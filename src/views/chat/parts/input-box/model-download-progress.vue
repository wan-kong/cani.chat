<template>
    <Transition name="fade">
        <div v-if="visible"
            class="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
            <svg v-if="isWorking" class="h-3.5 w-3.5 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <svg v-else-if="progress?.state === 'error'" class="h-3.5 w-3.5 text-red-500"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div class="flex flex-1 flex-col gap-1">
                <div class="flex items-center justify-between gap-2">
                    <span>{{ label }}</span>
                    <span v-if="progress?.state === 'downloading'" class="font-mono tabular-nums">
                        {{ percent }}%
                    </span>
                </div>
                <div v-if="progress?.state === 'downloading' || progress?.state === 'loading'"
                    class="relative h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div :class="[
                        'absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-200',
                        progress?.state === 'loading' ? 'animate-pulse' : '',
                    ]" :style="{ width: progress?.state === 'loading' ? '100%' : percent + '%' }" />
                </div>
            </div>
            <button v-if="progress?.state === 'downloading'" type="button"
                class="rounded px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted"
                @click="emit('cancel')">
                取消
            </button>
        </div>
    </Transition>
</template>

<script setup lang="ts" name="modelDownloadProgress">
import { computed } from 'vue'
import type { DownloadProgress } from '@/hooks/useModelDownload'

const props = defineProps<{
    progress: DownloadProgress | undefined
    model: AIModel
}>()

const emit = defineEmits<{
    (e: 'cancel'): void
}>()

const visible = computed(() => {
    const s = props.progress?.state
    return s === 'downloadable' || s === 'downloading' || s === 'loading' || s === 'error'
})

const isWorking = computed(() => {
    const s = props.progress?.state
    return s === 'downloading' || s === 'loading' || s === 'downloadable'
})

const percent = computed(() => {
    const p = props.progress?.process ?? 0
    return Math.round(p * 100)
})

const modelLabel = computed(() => {
    switch (props.model) {
        case 'languageModel':
            return 'Prompt'
        case 'summarizer':
            return 'Summarizer'
        case 'writer':
            return 'Writer'
        case 'rewriter':
            return 'Rewriter'
        default:
            return String(props.model)
    }
})

const label = computed(() => {
    const state = props.progress?.state
    const name = modelLabel.value
    switch (state) {
        case 'downloadable':
            return `${name} 模型待下载…`
        case 'downloading':
            return `正在下载 ${name} 模型`
        case 'loading':
            return `${name} 模型下载完成，正在加载到内存…`
        case 'error':
            return `${name} 模型加载失败：${props.progress?.error ?? '未知错误'}`
        default:
            return ''
    }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
