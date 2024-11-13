<template>
    <div class="h-full flex flex-col p-3 gap-2">
        <Textarea v-model="inputVal" class="w-full h-0 flex-1 min-h-5 resize-none focus-visible:shadow-none"
            placeholder="你想聊些什么？"></Textarea>
        <div class="flex flex-shrink-0 w-full items-center justify-between">
            <div class="flex items-center justify-center text-sm text-slate-500">
                答案由AI生成，可能存在错误，请注意甄别。
            </div>
            <div class="flex-shrink-0">
                <Button variant="outline" size="sm">
                    发送(Enter)
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="inputBox">
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button';
import { ref } from 'vue'

const inputVal = ref('')

</script>
