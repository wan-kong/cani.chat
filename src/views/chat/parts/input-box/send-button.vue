<template>
    <div class="flex-shrink-0">
        <!-- <processButton :value="processValue"></processButton> -->
        <Button variant="outline" v-if="props.loading" @click="emits('cancel')" size="sm" title="取消">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9 9V15H15V9H9Z">
                </path>
            </svg>
        </Button>
        <Button variant="outline" v-else @click="emits('send')" :disabled="disabled" size="sm" title="发送">
            发送(Enter)
        </Button>
    </div>
</template>

<script setup lang="ts" name="sendButton">
import { ref } from 'vue';
// import processButton from './process-button.vue';
import { Button } from '@/components/ui/button';
const emits = defineEmits<{
    (ev: 'send'): void
    (ev: 'cancel'): void
}>()

const props = defineProps<{
    disabled: boolean
    loading: boolean
}>()
const processValue = ref(0)
const creaseValue = () => {
    setTimeout(() => {
        processValue.value = processValue.value + 1
        if (processValue.value < 100) {
            creaseValue()
        }
    }, 200);
}
creaseValue()

</script>

<style scoped lang="scss"></style>