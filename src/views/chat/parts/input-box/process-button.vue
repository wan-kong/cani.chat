<template>
    <Button size="icon" variant="default" class="relative inline-flex items-center justify-center [&_svg]:size-6">
        <svg class="absolute">
            <line v-for="(_, i) in ticks" :key="`bg-${i}`" x1="12" y1="0" x2="12" y2="2" stroke="currentColor"
                class="text-gray-400" stroke-width="1" :transform="`rotate(${(360 / ticks) * i}, 12,12)`" />
            <template v-for="(_, i) in ticks">
                <line :key="`progress-${i}`" v-if="(i + 1) / ticks <= props.value / 100" x1="12" y1="0" x2="12" y2="2"
                    stroke="currentColor" stroke-width="1" :transform="`rotate(${(360 / ticks) * i}, 12, 12)`"
                    class="text-gray-200 transition-opacity duration-100"></line>
            </template>
        </svg>
        <span class="scale-50">{{ props.value }}</span>
    </Button>
</template>

<script setup lang="ts" name="processButton">
import Button from '@/components/ui/button/Button.vue';
const props = defineProps<{
    value: number
}>()
const ticks = 24

</script>

<style scoped lang="scss"></style>