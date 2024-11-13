<script setup lang="ts" name="markDownRender">
import { computed, ref } from 'vue'
import { useMarkdownRender } from './mdi'
import { useCopyCode } from './useCopyCode'

const props = withDefaults(defineProps<{
  text?: string
  html?: boolean
}>(), {
  html: false,
})

const contentRef = ref<HTMLDivElement>()
const { renderMarkdown } =  useMarkdownRender({
  html: props.html,
})

const text = computed(() => {
  return renderMarkdown(props.text ?? '-')
})
useCopyCode(contentRef)

</script>

<template>
  <div ref="contentRef" class="markdown-body" v-html="text" />
</template>

<style lang="scss">
@use '@/assets/md/github-markdown.scss';
@use '@/assets/md/highlight.scss';
@use '@/assets/md/style.scss';
</style>
