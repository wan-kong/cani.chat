import { checkIsChrome, chromeVersion } from '@/lib/utils'
import { computed, ref, type Ref, type ComputedRef } from 'vue'
import { checkAvailability, hasModelFactory } from './useModelDownload'

/**
 * useChromeAIReady
 * ------------------------------------------------------------------
 * 检查当前浏览器是否具备 Chrome 内置 AI（Prompt API 等）能力。
 *
 * 参考文档：
 *   https://developer.chrome.com/docs/ai/prompt-api
 *   https://developer.chrome.com/docs/ai/get-started
 *
 * - 新版 Chrome（138+）使用 `LanguageModel.availability()`；
 * - 旧版 Chrome 使用 `window.ai.languageModel.capabilities()`；
 * 本 hook 通过 {@link checkAvailability} 统一判断，并返回响应式的状态。
 */

export type ChromeAIStatus = {
    /** 统一后的四档可用性 */
    availability: Ref<AIAvailability>
    /** 兼容字段：旧版三档可用性 */
    status: ComputedRef<AICapabilityAvailability>
    loading: Ref<boolean>
    error: Ref<string | null>
    /** 重新检查；返回最新的 availability */
    retry: () => Promise<AIAvailability>
}

// 新版 Prompt API 从 Chrome 138 起稳定推出，但项目此前使用的是 130+ 的
// 早期试用版本。这里放宽到 127 以兼容早期预览版，并主要依赖 feature detection。
const MIN_CHROME_VERSION = 127
const MAX_RETRY = 3

export const useChromeAIReady = (): ChromeAIStatus => {
    const availability = ref<AIAvailability>('unavailable')
    const loading = ref(false)
    const error = ref<string | null>(null)
    const retryCount = ref(0)

    const status = computed<AICapabilityAvailability>(() => {
        switch (availability.value) {
            case 'available':
                return 'readily'
            case 'downloadable':
            case 'downloading':
                return 'after-download'
            default:
                return 'no'
        }
    })

    const checkStatus = async (): Promise<AIAvailability> => {
        if (loading.value) return availability.value
        loading.value = true
        error.value = null
        try {
            if (!checkIsChrome || chromeVersion < MIN_CHROME_VERSION) {
                error.value = `请使用 Chrome ${MIN_CHROME_VERSION}+ 版本访问`
                availability.value = 'unavailable'
                return 'unavailable'
            }

            if (!hasModelFactory('languageModel')) {
                error.value = '未检测到 Chrome 内置 AI 功能，请确认 Chrome 版本 ≥ 138 并启用 chrome://flags/#optimization-guide-on-device-model'
                availability.value = 'unavailable'
                return 'unavailable'
            }

            const result = await checkAvailability('languageModel')
            availability.value = result

            if (result === 'unavailable') {
                error.value = '当前设备不支持 Chrome 内置 AI'
            }

            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : '检查 AI 功能时发生未知错误'
            availability.value = 'unavailable'
            return 'unavailable'
        } finally {
            loading.value = false
        }
    }

    const retry = async (): Promise<AIAvailability> => {
        if (retryCount.value >= MAX_RETRY) {
            error.value = '已达到最大重试次数'
            return availability.value
        }
        retryCount.value++
        return checkStatus()
    }

    // 初始检查（非阻塞）
    void checkStatus()

    return {
        availability,
        status,
        loading,
        error,
        retry,
    }
}
