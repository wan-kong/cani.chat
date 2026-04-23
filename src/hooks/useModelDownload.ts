import { reactive, readonly } from 'vue'

/**
 * useModelDownload
 * ------------------------------------------------------------------
 * 参考最新 Chrome 内置 AI 文档：
 *   https://developer.chrome.com/docs/ai/prompt-api
 *   https://developer.chrome.com/docs/ai/inform-users-of-model-download
 *
 * - 新版 Chrome（138+）将工厂提升为全局变量：LanguageModel / Summarizer / Writer /
 *   Rewriter，并提供 `availability()` 方法，返回:
 *     'unavailable' | 'downloadable' | 'downloading' | 'available'
 *   `create()` 时仍通过 `monitor(m) { m.addEventListener('downloadprogress', ...) }`
 *   订阅下载进度，其中事件的 `loaded` 已为 0..1 的分数。
 * - 旧版 Chrome 则通过 `window.ai.<model>.capabilities()` 与 create 的 `monitor`
 *   回调（事件中同时带 `loaded` 与 `total`）。
 *
 * 本 hook 统一封装这两种形态：
 *   - 暴露 **响应式** 的 `progress` 状态，供 UI 展示下载进度；
 *   - 提供 `checkAvailability(model)`、`sessionOption(model)`、`cancelDownload(model)` 等 API；
 *   - 修复了原实现中 `controller.abort` 未绑定 `this` 导致调用时抛错的 bug；
 *   - 适配新版 `downloadprogress` 事件（没有 `total`、`loaded` 为 0..1）。
 */

export type ModelDownloadState =
    | 'idle'
    | 'downloadable'
    | 'downloading'
    | 'loading'
    | 'ready'
    | 'canceled'
    | 'unavailable'
    | 'error'

export interface DownloadProgress {
    /** 下载分数 0..1（新版 API 直接给出；旧版由 loaded/total 推导） */
    process: number
    /** 已加载字节数或分数（保持旧字段名以兼容老代码） */
    loaded: number
    /** 总字节数；新版无此字段时固定为 1 */
    total: number
    /** 当前状态 */
    state: ModelDownloadState
    /** 若有错误信息，记录在此处 */
    error?: string
}

function createInitialProgress(): DownloadProgress {
    return {
        process: 0,
        loaded: 0,
        total: 1,
        state: 'idle',
    }
}

// 模块级共享状态：跨组件共享同一份下载进度
const progressMap = reactive<Record<string, DownloadProgress>>({})
const controllerMap = new Map<AIModel, AbortController>()

function ensureProgress(model: AIModel): DownloadProgress {
    let p = progressMap[model]
    if (!p) {
        p = createInitialProgress()
        progressMap[model] = p
    }
    return p
}

/** 新版 AIModel -> 新版全局名 */
const GLOBAL_NAME_MAP: Record<AIModel, string> = {
    languageModel: 'LanguageModel',
    summarizer: 'Summarizer',
    writer: 'Writer',
    rewriter: 'Rewriter',
}

interface ModelFactoryLike {
    create: (options?: any) => Promise<any>
    availability?: (options?: any) => Promise<AIAvailability>
    capabilities?: () => Promise<{ available: AICapabilityAvailability }>
}

/**
 * 依次尝试：
 *   1. 新版全局工厂（e.g. `globalThis.LanguageModel`）
 *   2. 旧版 `window.ai.<model>` 工厂
 */
export function resolveModelFactory(model: AIModel): ModelFactoryLike | null {
    const globalName = GLOBAL_NAME_MAP[model]
    if (globalName && typeof globalThis !== 'undefined') {
        const candidate = (globalThis as any)[globalName]
        if (candidate && typeof candidate.create === 'function') {
            return candidate as ModelFactoryLike
        }
    }
    if (typeof window !== 'undefined' && window.ai && model in window.ai) {
        const candidate = (window.ai as any)[model]
        if (candidate && typeof candidate.create === 'function') {
            return candidate as ModelFactoryLike
        }
    }
    return null
}

/**
 * 在非开发/测试环境下判断当前浏览器是否支持该模型对应的内置 AI API。
 * 仅探测工厂是否存在，不触发下载。
 */
export function hasModelFactory(model: AIModel): boolean {
    return resolveModelFactory(model) !== null
}

/**
 * 查询某个模型的可用性。返回值统一为新版四档枚举。
 * options 会原样透传给新版 availability()；旧版仅支持无参查询。
 */
export async function checkAvailability(
    model: AIModel,
    options?: AIAvailabilityOptions,
): Promise<AIAvailability> {
    const factory = resolveModelFactory(model)
    if (!factory) return 'unavailable'

    if (typeof factory.availability === 'function') {
        try {
            const result = await factory.availability(options)
            // 一些早期实现可能返回旧字符串，统一做一次映射
            return normalizeAvailability(result)
        } catch {
            return 'unavailable'
        }
    }

    if (typeof factory.capabilities === 'function') {
        try {
            const cap = await factory.capabilities()
            return normalizeAvailability(cap?.available)
        } catch {
            return 'unavailable'
        }
    }

    return 'unavailable'
}

function normalizeAvailability(
    value: AIAvailability | AICapabilityAvailability | string | undefined,
): AIAvailability {
    switch (value) {
        case 'available':
        case 'readily':
            return 'available'
        case 'downloadable':
        case 'after-download':
            return 'downloadable'
        case 'downloading':
            return 'downloading'
        case 'unavailable':
        case 'no':
        case undefined:
        default:
            return 'unavailable'
    }
}

export const useModelDownload = () => {
    /**
     * 产出传给 `*.create()` 的选项片段：AbortSignal + 下载进度监听。
     * 同一个 model 每次调用会替换掉上一次的 AbortController。
     */
    const sessionOption = (model: AIModel): {
        monitor: AICreateMonitorCallback
        signal: AbortSignal
    } => {
        // 覆盖：如果上一次还在下载中，先取消
        controllerMap.get(model)?.abort()

        const controller = new AbortController()
        controllerMap.set(model, controller)

        const progress = ensureProgress(model)
        progress.process = 0
        progress.loaded = 0
        progress.total = 1
        progress.state = 'downloading'
        progress.error = undefined

        return {
            signal: controller.signal,
            monitor: (monitor) => {
                monitor.addEventListener('downloadprogress', (event) => {
                    const loaded = typeof event.loaded === 'number' ? event.loaded : 0
                    const totalRaw = typeof event.total === 'number' ? event.total : undefined

                    let fraction: number
                    if (totalRaw && totalRaw > 1) {
                        // 旧版：loaded/total 为字节数
                        fraction = totalRaw > 0 ? loaded / totalRaw : 0
                    } else {
                        // 新版：loaded 已经是 0..1 的分数
                        fraction = loaded
                    }

                    fraction = Math.max(0, Math.min(1, fraction))
                    progress.process = fraction
                    progress.loaded = fraction
                    progress.total = 1
                    // loaded === 1 时模型仍需解压/加载进内存，标记为 loading
                    progress.state = fraction >= 1 ? 'loading' : 'downloading'
                })
            },
        }
    }

    const getProgress = (model: AIModel): DownloadProgress | undefined => {
        return progressMap[model]
    }

    /** 等价于旧版 `getProcess`，保留以兼容现有调用方。 */
    const getProcess = getProgress

    const cancelDownload = (model: AIModel) => {
        controllerMap.get(model)?.abort()
        controllerMap.delete(model)
        const p = ensureProgress(model)
        if (p.state === 'downloading' || p.state === 'loading') {
            p.state = 'canceled'
        }
    }

    const markReady = (model: AIModel) => {
        const p = ensureProgress(model)
        p.state = 'ready'
        p.process = 1
        p.loaded = 1
        p.total = 1
        p.error = undefined
        controllerMap.delete(model)
    }

    const markError = (model: AIModel, error: unknown) => {
        const p = ensureProgress(model)
        // 被我们自己 abort 时保留 canceled 状态；模型已 ready 时不要被后续
        // 任务/prompt 错误污染为 error。
        if (p.state === 'canceled' || p.state === 'ready') return
        p.state = 'error'
        p.error = error instanceof Error ? error.message : String(error)
        controllerMap.delete(model)
    }

    const reset = (model: AIModel) => {
        progressMap[model] = createInitialProgress()
        controllerMap.delete(model)
    }

    /**
     * 主动触发模型下载并返回就绪的 session；调用方可提前唤起下载，
     * 避免首次 prompt 时才开始。失败抛出异常。
     */
    const ensureModelDownloaded = async <T extends AIModel>(
        model: T,
        createOptions: Record<string, any> = {},
    ): Promise<any> => {
        const factory = resolveModelFactory(model)
        if (!factory) {
            const p = ensureProgress(model)
            p.state = 'unavailable'
            throw new Error(`当前浏览器不支持 ${model} API`)
        }

        const availability = await checkAvailability(model)
        const p = ensureProgress(model)
        if (availability === 'unavailable') {
            p.state = 'unavailable'
            throw new Error(`${model} 当前不可用`)
        }
        if (availability === 'available') {
            p.state = 'ready'
            p.process = 1
            p.loaded = 1
            p.total = 1
        }

        try {
            const session = await factory.create({
                ...sessionOption(model),
                ...createOptions,
            })
            markReady(model)
            return session
        } catch (err) {
            markError(model, err)
            throw err
        }
    }

    return {
        /** 只读的响应式进度快照，键为 AIModel */
        progress: readonly(progressMap),
        getProgress,
        getProcess,
        checkAvailability,
        hasModelFactory,
        resolveModelFactory,
        sessionOption,
        cancelDownload,
        markReady,
        markError,
        reset,
        ensureModelDownloaded,
    }
}
