<template>
    <div class="h-full flex flex-col p-2 gap-2">
        <Textarea v-model="inputVal" :disabled="activeUserInput?.disabled"
            class="w-full flex-1 h-0 min-h-5 resize-none focus-visible:shadow-none"
            :placeholder="activeUserInput?.placeholder || DEFAULT_PLACEHOLDER" @keydown="handleKeyDown"></Textarea>
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

let cancelMap = new Map<SessionItem['id'], AbortController>()


const handleSendData = () => {
    if (inputVal.value) {
        const sessionID = store.activeSessionId
        const messageID = getUUID()
        const controller = new AbortController()

        store.addMessageItem({
            id: getUUID(),
            content: inputVal.value,
            role: 'user',
            status: 'completed',
            create_at: parseTime(Date.now()),
            update_at: parseTime(Date.now()),
            session_id: sessionID,
        }, sessionID)

        cancelMap.set(messageID, controller)
        chatToChrome(inputVal.value, {
            mode: store.activeSession?.mode ?? 'languageModel',
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
                cancelMap.delete(messageID)
                store.setUserInputLoading(false, sessionID)
            }
        })
        inputVal.value = ''
        store.addMessageItem({
            id: messageID,
            content: '正在生成中...',
            role: 'assistant',
            status: 'loading',
            create_at: parseTime(Date.now()),
            update_at: parseTime(Date.now()),
            session_id: sessionID,
        })
        store.setUserInputLoading(true, sessionID)
    } else {
        formateLog("Submit", "User input data is empty string", "error")
    }
}

const handleCancelData = () => {
    const sessionID = store.activeSessionId
    const abortFN = cancelMap.get(sessionID)?.abort
    if (abortFN) {
        abortFN()
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
