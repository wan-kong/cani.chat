<template>
    <div class="flex-shrink-0 p-2 flex items-center justify-around">
        <DarkMode></DarkMode>
        <GitHub></GitHub>
        <DataProcessing></DataProcessing>
        <HomeOrTips></HomeOrTips>
    </div>
</template>

<script setup lang="ts" name="footerPart">
import DataProcessing from './data-processing.vue'
import HomeOrTips from './tips.vue'
import GitHub from './github.vue'
import DarkMode from './dark-mode.vue';
</script>
