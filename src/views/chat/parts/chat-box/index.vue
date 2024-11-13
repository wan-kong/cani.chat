<template>
    <div class="h-full flex flex-col overflow-hidden">
        <div class="w-full flex-shrink-0 sticky top-0 p-4 py-3 border-b border border-x-0 border-t-0">
            Chat To Chrome
        </div>
        <ScrollArea ref="scrollRef" class="flex-1 h-0 flex flex-col flex-shrink-0 p-4 pb-1 overflow-x-hidden">
            <msgItem v-for="item in 10" :key="item" :role="item % 2 === 0 ? 'system' : 'user'"></msgItem>
        </ScrollArea>
    </div>
</template>

<script setup lang="ts" name="chatBox">
import { useScroll } from '@/hooks/useScroll';
import { ScrollArea } from '@/components/ui/scroll-area';
import msgItem from './msg-item.vue'
import { onMounted } from 'vue';
const { scrollRef, scrollToBottom, } = useScroll()
onMounted(() => {
    scrollToBottom()
})
</script>
