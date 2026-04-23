<template>
    <div class="h-full flex flex-col p-2 gap-2">
        <Textarea v-model="inputVal" :disabled="activeUserInput?.disabled"
            class="w-full flex-1 h-0 min-h-5 resize-none focus-visible:shadow-none"
            :placeholder="activeUserInput?.placeholder || DEFAULT_PLACEHOLDER" @keydown="handleKeyDown"></Textarea>
        <ModelDownloadProgress :model="activeModel" :progress="activeProgress"
            @cancel="handleCancelDownload" />
        <div class="flex flex-shrink-0 w-full items-center justify-between">
            <div class="flex items-center justify-center text-sm text-slate-500">
                答案由AI生成，可能存在错误，请注意甄别。
            </div>
            <SendButton :disabled="activeUserInput?.disabled || (inputVal ?? '') === ''"
                :loading="activeUserInput?.loading ?? false" @send="handleSendData()" @cancel="handleCancelData()">
            </SendButton>
        </div>
    </div>
</template>

<script setup lang="ts" name="inputBox">
import { Textarea } from '@/components/ui/textarea'
import { computed } from 'vue'
import { useGlobalState } from '@/lib/store';
import { useComposition } from '@/hooks/useComposition';
import { getKeyDownHandler, KEYBOARD_KEY } from '@/lib/keyboard';
import { DEFAULT_PLACEHOLDER } from '@/config';
import { formateLog, getUUID, parseTime } from '@/lib/utils';
import { chatToChrome } from '@/lib/chatToChrome';
import { SessionItem } from '@/types/interface';
import SendButton from './send-button.vue';
import ModelDownloadProgress from './model-download-progress.vue';
import { useModelDownload } from '@/hooks/useModelDownload';

const store = useGlobalState()

const activeUserInput = computed(() => store.activeUserInput)

const inputVal = computed({
    get: () => {
        return activeUserInput.value?.content ?? ''
    },
    set: (val: string) => {
        store.setUserInputContent(val)
    }
})

const { isComposing } = useComposition()

// key 为 sessionID：同一会话同一时刻只会有一条生成中的消息，
// 取消按钮是会话维度的，必须和 key 对齐。
let cancelMap = new Map<SessionItem['id'], AbortController>()

const { progress, cancelDownload } = useModelDownload()

const activeModel = computed<AIModel>(() => store.activeSession?.model ?? 'languageModel')
const activeProgress = computed(() => progress[activeModel.value])

const handleCancelDownload = () => {
    cancelDownload(activeModel.value)
}

const handleSendData = () => {
    if (inputVal.value) {
        const sessionID = store.activeSessionId
        const model = activeModel.value
        const messageID = getUUID()
        const controller = new AbortController()

        const userInput = inputVal.value
        store.addMessageItem({
            id: getUUID(),
            content: userInput,
            role: 'user',
            status: 'completed',
            create_at: parseTime(Date.now()),
            update_at: parseTime(Date.now()),
            session_id: sessionID,
        }, sessionID)
        cancelMap.set(sessionID, controller)
        // 先占位，再发起对话：chatToChrome 的同步错误分支会在微任务内立刻触发
        // onError，若此时占位消息尚未入库，updateMessageItem 就会找不到目标 id，
        // 造成气泡永远卡在 loading 状态。
        store.addMessageItem({
            id: messageID,
            content: '正在生成中...',
            role: 'assistant',
            status: 'loading',
            create_at: parseTime(Date.now()),
            update_at: parseTime(Date.now()),
            session_id: sessionID,
        }, sessionID)
        store.setUserInputLoading(true, sessionID)
        inputVal.value = ''
        chatToChrome(userInput, {
            model: model,
            // chatToChrome 默认会附上 monitor/signal 以跟踪下载进度，
            // 无需再手动传 sessionOptions.monitor。
            taskOptions: {
                signal: controller.signal
            },
            onDataUpdate: (data) => {
                store.updateMessageItem({
                    id: messageID,
                    content: data,
                    status: "running",
                    update_at: parseTime(Date.now()),
                }, sessionID)
            },
            onCompleted: () => {
                store.updateMessageItem({
                    id: messageID,
                    status: 'completed',
                    update_at: parseTime(Date.now()),
                }, sessionID)
                cancelMap.delete(sessionID)
                store.setUserInputLoading(false, sessionID)
            },
            onError: (error) => {
                store.updateMessageItem({
                    id: messageID,
                    content: error?.message ?? error.toString(),
                    status: 'error',
                    update_at: parseTime(Date.now()),
                }, sessionID)
                cancelMap.delete(sessionID)
                store.setUserInputLoading(false, sessionID)
            }
        })
    } else {
        formateLog("Submit", "User input data is empty string", "error")
    }
}

const handleCancelData = () => {
    const sessionID = store.activeSessionId
    const controller = cancelMap.get(sessionID)
    if (controller) {
        // 必须在实例上调用 abort()，否则解构出来的 .abort 会丢失 this 绑定
        controller.abort()
        cancelMap.delete(sessionID)
        store.setUserInputLoading(false, sessionID)
    }
}
const handleKeyDown = getKeyDownHandler(new Map([
    [
        {
            key: KEYBOARD_KEY.ENTER,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            altKey: false,
        },
        (e: Event) => {

            if (!isComposing.value) {
                e.preventDefault()
                handleSendData()
            }

        },
    ],
])
)



</script>
