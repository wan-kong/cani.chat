<template>
    <div class="flex items-center flex-col justify-center border shadow-md w-max p-10 mx-auto">
        <div>设备检测中</div>
        <div>请稍等...</div>
    </div>
</template>

<script setup lang="ts" name="check">
defineProps<{
    loading: boolean
}>()

</script>

<style scoped lang="scss"></style>