import type { Ref } from 'vue'
import { nextTick, ref, onMounted } from 'vue'

type ScrollElement = HTMLDivElement | null

interface ScrollReturn {
  scrollRef: Ref<ScrollElement>
  scrollToBottom: () => Promise<void>
  scrollToTop: () => Promise<void>
  scrollTo: ({ x, y }?: {
    x: number
    y: number
  }) => Promise<void>
  scrollLeftNext: (len: number) => Promise<void>
  scrollToBottomIfAtBottom: () => Promise<void>
}

export function useScroll(threshold = 50): ScrollReturn {
  const scrollRef = ref<ScrollElement>(null)

  const scrollTo = async ({ x, y } = { x: 0, y: 0 }) => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTo(x, y)
  }

  const scrollToBottom = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }

  const scrollLeftNext = async (len: number) => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scroll({ left: scrollRef.value.scrollLeft + len, top: 0, behavior: 'smooth' })
  }

  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = 0
  }

  const scrollToBottomIfAtBottom = async () => {
    await nextTick()
    if (scrollRef.value) {
      const distanceToBottom = scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
      if (distanceToBottom <= threshold)
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  }

  onMounted(() => {
    scrollToBottom()
  })
  return {
    scrollRef,
    scrollTo,
    scrollToBottom,
    scrollToTop,
    scrollLeftNext,
    scrollToBottomIfAtBottom,
  }
}
