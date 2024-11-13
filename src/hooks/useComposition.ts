import { onMounted, onUnmounted, ref } from "vue"

export const useComposition = () => {
  const isComposing = ref(false)

  const startComposing = () => {
    isComposing.value = true
  }
  const endComposing = () => {
    isComposing.value = false
  }

  onMounted(() => {
    window.addEventListener('compositionstart', startComposing)
    window.addEventListener('compositionend', endComposing)
  })

  onUnmounted(() => {
    window.removeEventListener('compositionstart', startComposing)
    window.removeEventListener('compositionend', endComposing)
  })

  return {
    isComposing,
    startComposing,
    endComposing,
  }
}
