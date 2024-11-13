<template>
    <div class="flex flex-1 w-0 overflow-hidden items-center justify-start group gap-2">
        <template v-if="!isEditing">
            <div class="overflow-hidden whitespace-nowrap overflow-ellipsis">{{ props.modelValue }}
            </div>
            <Button variant="link" size="icon" title="编辑" @click="handleEdit" class="opacity-0 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M7.24264 17.9967H3V13.754L14.435 2.319C14.8256 1.92848 15.4587 1.92848 15.8492 2.319L18.6777 5.14743C19.0682 5.53795 19.0682 6.17112 18.6777 6.56164L7.24264 17.9967ZM3 19.9967H21V21.9967H3V19.9967Z">
                    </path>
                </svg>
            </Button>
        </template>
        <template v-else>
            <Input v-model="userInput" class="w-max" @keydown.enter="handleUpdate()" @blur="handleCancel()" />
            <Button variant="ghost" size="icon" title="保存标题更改" @click.stop="handleUpdate()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z">
                    </path>
                </svg>
            </Button>
        </template>
    </div>
</template>

<script setup lang="ts" name="editableTitle">
import { ref } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const props = defineProps<{
    modelValue: string
}>()

const emits = defineEmits<{
    (ev: "update:modelValue", value: string): void
    (ev: 'change', value: string): void
}>()
const userInput = ref(props.modelValue)

const isEditing = ref(false)
const handleUpdate = () => {
    isEditing.value = false
    if ((userInput.value ?? '') !== '') {
        emits('change', userInput.value)
        emits('update:modelValue', userInput.value)
    } else {
        userInput.value = props.modelValue
    }
}
const handleEdit = () => {
    userInput.value = props.modelValue
    isEditing.value = true
}
const handleCancel = () => {
    setTimeout(() => {
        isEditing.value = false
    }, 300);
}

</script>

<style scoped lang="scss"></style>