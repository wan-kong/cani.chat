import { useLocalStorage } from "@vueuse/core"
import { onMounted } from "vue"

export const useMaxScreen = () => {


    const isMaxScreen = useLocalStorage('screen_max', false)

    const checkIsMaxScreen = () => {
        // 判断是否全屏
        isMaxScreen.value && maxScreen()
    }


    const maxScreen = () => {
        const container = document.querySelector('#app > .container') as HTMLDivElement
        container.setAttribute('style', 'max-width: 100vw!important;height: 100vh!important;')
        isMaxScreen.value = true
    }

    const resetScreen = () => {
        const container = document.querySelector('#app > .container') as HTMLDivElement
        container.setAttribute('style', '')
        isMaxScreen.value = false
    }

    const toggleScreen = () => {
        isMaxScreen.value ? resetScreen() : maxScreen()
    }

    onMounted(() => {

        checkIsMaxScreen()
    })


    return {
        toggleScreen,
        maxScreen,
        resetScreen,
        isMaxScreen,
    }
}