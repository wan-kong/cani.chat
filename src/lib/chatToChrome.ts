import {
    checkAvailability,
    resolveModelFactory,
    useModelDownload,
} from '@/hooks/useModelDownload'
import { formateLog } from './utils'

type AIModelOptionsMap = {
    languageModel: AIAssistantCreateOptions;
    rewriter: AIRewriterCreateOptions;
    summarizer: AISummarizerCreateOptions;
    writer: AIWriterCreateOptions;
};

type AIModelTaskOptionsMap = {
    languageModel: AIAssistantPromptOptions;
    rewriter: AIRewriterRewriteOptions;
    summarizer: AISummarizerSummarizeOptions;
    writer: AIWriterWriteOptions;
};

type AIModelInstanceMap = {
    languageModel: AIAssistant;
    rewriter: AIRewriter;
    summarizer: AISummarizer;
    writer: AIWriter;
};

type SessionOptions<T extends AIModel> = T extends keyof AIModelOptionsMap ? AIModelOptionsMap[T] : AIAssistantCreateOptions;
type TaskOptions<T extends AIModel> = T extends keyof AIModelTaskOptionsMap ? AIModelTaskOptionsMap[T] : AIAssistantPromptOptions;
type AIInstance<T extends AIModel> = T extends keyof AIModelInstanceMap ? AIModelInstanceMap[T] : AIAssistant;

interface UseChromeAiOptions<T extends AIModel> {
    // 要使用的模型
    model: T
    // 是否使用数据流方式 （默认为 true: 流式输出）
    async?: boolean
    onDataUpdate?: (data: string) => void
    onCompleted?: () => void
    onError?: (error: any) => void
    // 下载进度更新（可选）
    onDownloadProgress?: (progress: number) => void
    // 会话参数
    sessionOptions?: SessionOptions<T>
    // 任务参数
    taskOptions?: TaskOptions<T>
}

type PromiseFunctionKeys<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? K : never
}[keyof T];


function _getTaskKey<T extends AIModel>(mode: T, async = true) {
    const taskKeys = {
        languageModel: 'prompt',
        rewriter: 'rewrite',
        summarizer: 'summarize',
        writer: 'write'
    } as const
    return `${async ? taskKeys[mode] + 'Streaming' : taskKeys[mode]}` as PromiseFunctionKeys<AIInstance<T>>

}


export async function chatToChrome<T extends AIModel>(input: string, options: UseChromeAiOptions<T>) {
    const mode = options.model
    formateLog('CHAT', `开始对话，使用模型 ${mode}，输入：${input}`)
    const isAsync = options?.async ?? true

    const { markReady, markError, sessionOption: defaultSessionOption } = useModelDownload()

    let session: any
    try {
        const factory = resolveModelFactory(mode)
        if (!factory) {
            throw new Error(`当前浏览器不支持 ${mode} API，请使用 Chrome 138+ 版本并启用相关 flag`)
        }

        const availability = await checkAvailability(mode)
        if (availability === 'unavailable') {
            throw new Error(`${mode} 当前不可用（availability=unavailable）`)
        }

        // 仅在确实可能触发下载时才注入默认 monitor/signal，避免模型已 available
        // 时 UI 短暂闪烁出 "正在下载..." 状态。
        const needsDownloadTracking = availability !== 'available'
        const userSession = (options.sessionOptions ?? {}) as any
        const userHasMonitor = 'monitor' in userSession || 'signal' in userSession
        const sessionOptsFinal = {
            ...(needsDownloadTracking && !userHasMonitor ? defaultSessionOption(mode) : {}),
            ...userSession,
        }

        try {
            session = await factory.create(sessionOptsFinal)
        } catch (createError) {
            // 仅在会话 / 模型创建阶段失败时，才把下载状态标记为 error
            markError(mode, createError)
            throw createError
        }

        // 创建成功即视为模型就绪
        markReady(mode)
    } catch (error) {
        formateLog('CHAT', `对话出错，错误：${error}`)
        options?.onError?.(error)
        return
    }

    // —— 以下属于任务执行阶段；此处出错不应污染下载状态 ——
    // ts写不明白了，先用any了
    const taskKey = _getTaskKey(mode, isAsync)
    try {
        if (isAsync) {
            const stream = session[taskKey](input, { ...options?.taskOptions }) as ReadableStream<string>
            for await (const chunk of stream) {
                formateLog('CHAT', `流式对话加载，输出：${chunk}`)
                options?.onDataUpdate?.(chunk)
            }
            options?.onCompleted?.()
        } else {
            const res = await session[taskKey](input, { ...options?.taskOptions }) as string
            formateLog('CHAT', `对话完成，输出：${res}`)
            options?.onDataUpdate?.(res)
            options?.onCompleted?.()
        }
    } catch (error) {
        formateLog('CHAT', `对话出错，错误：${error}`)
        options?.onError?.(error)
    } finally {
        try {
            session.destroy?.()
        } catch {
            /* ignore */
        }
    }
}
