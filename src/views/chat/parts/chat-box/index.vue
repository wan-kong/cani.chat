<template>
    <div class="h-full flex flex-col overflow-hidden">
        <div
            class="h-14 w-full flex-shrink-0 sticky top-0 border-b border border-x-0 border-t-0 flex items-center justify-between px-4 gap-2">
            <editableTitle v-model="title"></editableTitle>
            <chatSetting></chatSetting>
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
import chatSetting from './setting.vue'
import editableTitle from './editable-title.vue';
import { computed, onMounted } from 'vue';
import { useGlobalState } from '@/lib/store';
const { scrollRef, scrollToBottom, } = useScroll()
onMounted(() => {
    scrollToBottom()
})
const store = useGlobalState()
const title = computed({
    get: () => {
        return store.activeSession?.name ?? ''
    },
    set: (val) => {
        store.setSessionName(val)
    }
})
</script>
