import { checkIsChrome, chromeVersion } from "@/lib/utils"
import { ref } from "vue"

export const useChromeAIReady = () => {

    const status = ref<AICapabilityAvailability>('no')
    const loading = ref(false)

    const checkStatus = (): Promise<AICapabilityAvailability> => {
        return new Promise((resolve, reject) => {
            // 判断是否是Chrome浏览器且版本大于130
            if(!checkIsChrome || chromeVersion <=130 ){
                resolve("no")
            }
            if (status.value === 'readily') {
                resolve("readily")
            }
            loading.value = true
            if ('ai' in window && 'languageModel' in window.ai) {
                window.ai.languageModel.capabilities().then((res) => {
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

    checkStatus().then((res)=>{
        status.value = res
    })

    return {
        loading,
        status
    }

}