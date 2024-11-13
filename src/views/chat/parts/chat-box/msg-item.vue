<template>
    <div :class="cn('w-full')">
        <div :class="cn('flex flex-col', isUser ? 'w-max-[80%] items-end' : 'items-start')">
            <div :class="cn('px-2 mt-1 p-4',
                isUser ? 'max-w-[80%] w-max border bg-gray-10 rounded-md transition-all' : 'w-full'
            )">
                <MdText :text="text" html>
                </MdText>
            </div>
            <div :class="cn('mt-1 flex text-gray-500', isUser ? 'flex-row' : 'flex-row-reverse')">
                <Button variant="ghost" size="icon" @click="copy('123')" title="复制内容">
                    <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z">
                        </path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5"
                        fill="currentColor">
                        <path
                            d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z">
                        </path>
                    </svg>
                </Button>
                <Button variant="ghost" size="icon" @click="copy('123')" title="删除这条数据">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-3" fill="currentColor">
                        <path
                            d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z">
                        </path>
                    </svg>
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="msg-item">
import { Button } from '@/components/ui/button'
import { useClipboard } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { computed, ref } from 'vue'
import MdText from '@/components/md-text/index.vue'

const props = defineProps<{
    role: 'system' | 'user'
}>()
const isUser = computed(() => props.role === 'user')
const { copy, copied } = useClipboard()
const text = ref(`
### 你好
Lorem ipsum dolor sit amet consectetur adipisicing elit.Perferendis velit quibusdam omnis nihil quia, et, nemo cumque consequatur quod hic aliquid architecto, recusandae incidunt iusto nobis placeat deleniti? Quidem, illo?
\`\`\`shell
echo "hello world"
ps | grep "hello" 
\`\`\`

\`\`\`javascript
const a = 1
\`\`\`

> 引用

==123==

`)
</script>
