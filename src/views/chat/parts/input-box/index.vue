<template>
    <div class="h-full flex flex-col p-2 gap-2">
        <Textarea v-model="inputVal" :disabled="activeUserInput?.disabled"
            class="w-full flex-1 h-0 min-h-5 resize-none focus-visible:shadow-none"
            :placeholder="activeUserInput?.placeholder ?? DEFAULT_PLACEHOLDER" @keydown="handleKeyDown"></Textarea>
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

const handleSendData = () => {
    if (inputVal.value) {
        console.log('to send Data')
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
