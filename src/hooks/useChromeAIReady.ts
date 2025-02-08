import { checkIsChrome, chromeVersion } from "@/lib/utils"
import { ref } from "vue"

export type ChromeAIStatus = {
    status: AICapabilityAvailability
    loading: boolean
    error: string | null
    retry: () => Promise<AICapabilityAvailability>
}

export const useChromeAIReady = (): ChromeAIStatus => {
    const status = ref<AICapabilityAvailability>('no')
    const loading = ref(false)
    const error = ref<string | null>(null)
    const retryCount = ref(0)
    const MAX_RETRY = 3

    const checkStatus = async (): Promise<AICapabilityAvailability> => {
        return new Promise((resolve, reject) => {
            try {
                error.value = null
                // 判断是否是Chrome浏览器且版本大于130
                if (!checkIsChrome || chromeVersion <= 130) {
                    error.value = '请使用 Chrome 130+ 版本访问'
                    resolve("no")
                    return
                }

                if (status.value === 'readily') {
                    resolve("readily")
                    return
                }

                loading.value = true

                if (!('ai' in window)) {
                    error.value = '未检测到 Chrome AI 功能'
                    loading.value = false
                    resolve("no")
                    return
                }

                if (!('languageModel' in window.ai)) {
                    error.value = '未检测到语言模型功能'
                    loading.value = false
                    resolve("no")
                    return
                }

                window.ai.languageModel.capabilities()
                    .then((res) => {
                        status.value = res.available
                        if (res.available === 'readily' || res.available === 'after-download') {
                            resolve("readily")
                        } else {
                            error.value = '当前浏览器不支持 AI 功能'
                            reject(res.available)
                        }
                    })
                    .catch((err) => {
                        error.value = err.message || '检查 AI 功能时发生错误'
                        reject(err)
                    })
                    .finally(() => {
                        loading.value = false
                    })
            } catch (err) {
                error.value = err instanceof Error ? err.message : '未知错误'
                loading.value = false
                reject(err)
            }
        })
    }

    const retry = async () => {
        if (loading.value) return status.value
        if (retryCount.value >= MAX_RETRY) {
            error.value = '已达到最大重试次数'
            return status.value
        }

        retryCount.value++
        return checkStatus()
    }

    // 初始检查
    checkStatus().then((res) => {
        status.value = res
    }).catch(() => {
        // 错误已在 checkStatus 中处理
    })

    return {
        loading: loading.value,
        status: status.value,
        error: error.value,
        retry
    }
}