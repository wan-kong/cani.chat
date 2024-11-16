<template>
    <div class="h-full flex flex-col overflow-hidden">
        <div
            class="h-14 w-full flex-shrink-0 sticky top-0 border-b border border-x-0 border-t-0 flex items-center justify-between px-4 gap-2">
            <editableTitle v-model="title"></editableTitle>
            <maxScreen />
            <modeInfo />
            <chatSetting></chatSetting>
        </div>
        <ScrollArea ref="scrollRef" class="flex-1 h-0 flex flex-col flex-shrink-0 p-4 pb-1 overflow-x-hidden">
            <msgItem v-for="item in messageList" :key="item.id" :info="item" @delete="handleDeleteMessage(item)">
            </msgItem>
        </ScrollArea>
    </div>
</template>

<script setup lang="ts" name="chatBox">
import { ScrollArea } from '@/components/ui/scroll-area';
import msgItem from './msg-item.vue'
import chatSetting from './setting.vue'
import modeInfo from './mode-info.vue';
import maxScreen from './max-screen.vue';
import editableTitle from './editable-title.vue';
import { computed, onMounted, onUpdated, ref } from 'vue';
import { useGlobalState } from '@/lib/store';
import { MessageItem } from '@/types/interface';
import { formateLog } from '@/lib/utils';

const scrollRef = ref<InstanceType<typeof ScrollArea>>()

const scrollToBottom = () => {
    if (scrollRef.value?.$el === undefined) return
    const element = scrollRef.value.$el.children[0]
    if (element) {
        element.scrollTop = element.scrollHeight
    }

}
const threshold = 50
const scrollToBottomIfAtBottom = () => {
    const element = scrollRef.value?.$el?.children?.[0]
    if (element === undefined) return
    const distanceToBottom = element.scrollHeight - element.scrollTop - element.clientHeight
    formateLog('scrollToBottomIfAtBottom', distanceToBottom)
    if (distanceToBottom <= threshold) {
        scrollToBottom()
    }
}

onUpdated(() => {
    formateLog("scrollToBottomIfAtBottom")
    scrollToBottomIfAtBottom()
})

onMounted(() => {
    scrollToBottom()
})
const store = useGlobalState()
const messageList = computed(() => store.activeMessages)
const title = computed({
    get: () => {
        return store.activeSession?.name ?? ''
    },
    set: (val) => {
        store.setSessionName(val)
    }
})

const handleDeleteMessage = (item: MessageItem) => {
    store.deleteMessage(item.id, store.activeSessionId)
}
</script>
