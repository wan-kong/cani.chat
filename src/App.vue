<script setup lang="ts">
import Chat from '@/views/chat/index.vue'
import CheckPage from '@/views/check/index.vue'
import { useChromeAIReady } from './hooks/useChromeAIReady';

const { status,loading } = useChromeAIReady()
</script>

<template>
  <div class="container">
    <CheckPage v-if="status !== 'readily'" :loading="loading"></CheckPage>
    <Chat v-else></Chat>
  </div>
</template>

<style scoped></style>
