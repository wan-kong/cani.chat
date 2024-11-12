<template>
    <div class="h-full flex flex-col overflow-hidden">
        <div class="w-full flex-shrink-0 sticky top-0 p-4 bg-secondary">
            Chat To Chrome
        </div>
        <div class="flex-1 h-0 flex flex-col flex-shrink-0 overflow-y-auto px-4 py-4 overflow-x-hidden" ref="scrollRef">
            <msgItem v-for="item in 100" :key="item" :role="item % 2 === 0 ? 'system' : 'user'"></msgItem>
        </div>
    </div>
</template>

<script setup lang="ts" name="chatBox">
import { useScroll } from '@/hooks/useScroll';
import msgItem from './msg-item.vue'
import { onMounted } from 'vue';
const { scrollRef, scrollToBottom, } = useScroll()
onMounted(() => {
    scrollToBottom()
})
</script>

<style scoped lang="scss"></style>