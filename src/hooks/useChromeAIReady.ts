import { ref } from "vue"

export const useChromeAIReady = () => {

    const status = ref<AICapabilityAvailability>('no')
    const loading = ref(false)

    const checkStatus = (): Promise<AICapabilityAvailability> => {
        return new Promise((resolve, reject) => {
            if (status.value === 'readily') {
                resolve("readily")
            }
            loading.value = true
            if ('ai' in window && 'assistant' in window.ai) {
                window.ai.assistant.capabilities().then((res) => {
                    status.value = res.available
                    if (res.available === 'readily') {
                        resolve("readily")
                    } else {
                        reject(res.available)
                    }
                }).finally(() => {
                    loading.value = false
                })
            } else {
                loading.value = false
                resolve("no")
            }
        })
    }
    checkStatus()

    return {
        loading,
        status
    }

}