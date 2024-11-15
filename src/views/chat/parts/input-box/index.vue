<template>
    <div class="h-full flex flex-col p-2 gap-2">
        <Textarea v-model="inputVal" :disabled="activeUserInput?.disabled"
            class="w-full flex-1 h-0 min-h-5 resize-none focus-visible:shadow-none"
            :placeholder="activeUserInput?.placeholder || DEFAULT_PLACEHOLDER" @keydown="handleKeyDown"></Textarea>
        <div class="flex flex-shrink-0 w-full items-center justify-between">
            <div class="flex items-center justify-center text-sm text-slate-500">
                答案由AI生成，可能存在错误，请注意甄别。
            </div>
            <div class="flex-shrink-0">
                <Button variant="outline" @click="handleSendData()" :disabled="activeUserInput?.disabled" size="sm"
                    title="发送">
                    发送(Enter)
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="inputBox">
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button';
import { computed } from 'vue'
import { useGlobalState } from '@/lib/store';
import { useComposition } from '@/hooks/useComposition';
import { getKeyDownHandler, KEYBOARD_KEY } from '@/lib/keyboard';
import { DEFAULT_PLACEHOLDER } from '@/config';
import { useChromeAI } from '@/hooks/useChromeAi';
import { getUUID, parseTime } from '@/lib/utils';
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

let sessionID: string, messageID: string;

const { startTask } = useChromeAI({
    mode: 'assistant',
    onDataUpdate: (data) => {
        store.updateMessageItem({
            id: messageID,
            content: data,
            update_at: parseTime(Date.now()),
        }, sessionID)
    }
})

const handleSendData = () => {
    if (inputVal.value) {
        sessionID = store.activeSessionId
        store.addMessageItem({
            id: getUUID(),
            content: inputVal.value,
            role: 'user',
            create_at: parseTime(Date.now()),
            update_at: parseTime(Date.now()),
            session_id: sessionID,
        })
        startTask(inputVal.value)
        messageID = getUUID()
        store.addMessageItem({
            id: messageID,
            content: '正在生成中...',
            role: 'assistant',
            create_at: parseTime(Date.now()),
            update_at: parseTime(Date.now()),
            session_id: sessionID,
        })
    } else {
        console.warn("user input data is empty string")
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
