import type { MaybeRef } from 'vue'
import { onMounted, onUpdated, unref } from 'vue'
import { useClipboard } from '@vueuse/core'

export function useCopyCode(target: MaybeRef<HTMLElement | null | undefined> | HTMLElement) {
  const { copy } = useClipboard()
  function copyCodeBlock() {
    const root = unref(target)
    const codeBlockWrapper = root?.querySelectorAll('.code-block-wrapper') ?? []
    codeBlockWrapper.forEach((wrapper) => {
      const copyBtn = wrapper.querySelector('.code-block-extension-copyCodeBtn')
      const codeBlock = wrapper.querySelector('.code-block-body')
      const codeExpand = wrapper.querySelector('.code-block-extension-foldBtn')
      if (copyBtn && codeBlock) {
        copyBtn.addEventListener('click', () => {
          if (navigator.clipboard?.writeText)
            navigator.clipboard.writeText(codeBlock.textContent ?? '')
          else copy(codeBlock.textContent ?? '')
          copyBtn.innerHTML = '已复制！'
          setTimeout(() => {
            copyBtn.innerHTML = '复制'
          }, 3000)
        })
      }
      if (codeExpand) {
        codeExpand.addEventListener('click', () => {
          wrapper.classList.toggle('is-collapse')
        })
      }
    })
  }

  onMounted(() => copyCodeBlock())

  onUpdated(() => copyCodeBlock())
}
