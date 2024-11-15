<template>

    <Button variant="outline" size="icon" @click="toggleScreen">
        <ShrinkIcon v-if="isMaxScreen" />
        <ExpandIcon v-else />
    </Button>

</template>

<script setup lang="ts" name="chartSetting">
import { Button } from '@/components/ui/button';
import { useMaxScreen } from '@/hooks/useMaxScreen';
import { ExpandIcon,ShrinkIcon } from 'lucide-vue-next';

const { isMaxScreen,toggleScreen} =useMaxScreen()


</script>

<style scoped lang="scss"></style>