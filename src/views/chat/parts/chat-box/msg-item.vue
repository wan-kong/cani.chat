<template>
    <div class="w-full group">
        <div :class="cn('flex flex-col', isUser ? 'w-max-[80%] items-end' : 'items-start')">
            <div :class="cn('max-w-[80%]  px-2 mt-1 border w-max bg-gray-10 rounded-md transition-all p-2 min-h-10',
                isUser ? 'bg-[#1a73e8] text-white ' : 'bg-white text-black dark:bg-gray-800 dark:text-white'
            )">
                <div v-if="info.status === 'loading'" class="flex items-center justify-start">
                    <div class="animate-spin mx-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M11.9995 2C12.5518 2 12.9995 2.44772 12.9995 3V6C12.9995 6.55228 12.5518 7 11.9995 7C11.4472 7 10.9995 6.55228 10.9995 6V3C10.9995 2.44772 11.4472 2 11.9995 2ZM11.9995 17C12.5518 17 12.9995 17.4477 12.9995 18V21C12.9995 21.5523 12.5518 22 11.9995 22C11.4472 22 10.9995 21.5523 10.9995 21V18C10.9995 17.4477 11.4472 17 11.9995 17ZM20.6597 7C20.9359 7.47829 20.772 8.08988 20.2937 8.36602L17.6956 9.86602C17.2173 10.1422 16.6057 9.97829 16.3296 9.5C16.0535 9.02171 16.2173 8.41012 16.6956 8.13398L19.2937 6.63397C19.772 6.35783 20.3836 6.52171 20.6597 7ZM7.66935 14.5C7.94549 14.9783 7.78161 15.5899 7.30332 15.866L4.70525 17.366C4.22695 17.6422 3.61536 17.4783 3.33922 17C3.06308 16.5217 3.22695 15.9101 3.70525 15.634L6.30332 14.134C6.78161 13.8578 7.3932 14.0217 7.66935 14.5ZM20.6597 17C20.3836 17.4783 19.772 17.6422 19.2937 17.366L16.6956 15.866C16.2173 15.5899 16.0535 14.9783 16.3296 14.5C16.6057 14.0217 17.2173 13.8578 17.6956 14.134L20.2937 15.634C20.772 15.9101 20.9359 16.5217 20.6597 17ZM7.66935 9.5C7.3932 9.97829 6.78161 10.1422 6.30332 9.86602L3.70525 8.36602C3.22695 8.08988 3.06308 7.47829 3.33922 7C3.61536 6.52171 4.22695 6.35783 4.70525 6.63397L7.30332 8.13398C7.78161 8.41012 7.94549 9.02171 7.66935 9.5Z">
                            </path>
                        </svg>
                    </div>
                    别急，我在思考🤔
                </div>
                <MdText :text="info.content" html v-else>
                </MdText>
            </div>
            <div
                :class="cn('mt-1 transition-opacity flex text-gray-500 opacity-0 group-hover:opacity-100 gap-2', isUser ? 'flex-row' : 'flex-row-reverse')">
                <TooltipProvider :delayDuration="200" disableClosingTrigger>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" @click="copy(props.info.content)" title="复制内容">
                                <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path
                                        d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z">
                                    </path>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z">
                                    </path>
                                </svg>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {{ copied ? '已复制' : '复制内容' }}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" title="删除这条数据">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z">
                                </path>
                            </svg>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent :align="isUser ? 'end' : 'start'">
                        <div class="">确定要删除这条消息吗？</div>
                        <div class="flex items-center gap-2 mt-2 w-full justify-end"
                            :class="isUser ? '' : 'flex-row-reverse'">
                            <PopoverClose asChild>
                                <Button variant="outline" title="取消" size="sm">取消</Button>
                            </PopoverClose>
                            <Button variant="destructive" @click="emits('delete')" title="确认删除" size="sm">删除</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="msg-item">
import { Button } from '@/components/ui/button'
import { useClipboard } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { computed } from 'vue'
import MdText from '@/components/md-text/index.vue'

import {
    Popover,
    PopoverClose,
    PopoverTrigger,
    PopoverContent
} from '@/components/ui/popover'
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { MessageItem } from '@/types/interface'

const props = defineProps<{
    info: MessageItem
}>()
const isUser = computed(() => props.info.role === 'user')
const { copy, copied } = useClipboard()
const emits = defineEmits<{
    (ev: 'delete'): void
}>()
</script>
