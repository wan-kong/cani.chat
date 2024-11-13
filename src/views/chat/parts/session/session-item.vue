<template>
    <div
        :class="cn('w-full mb-2 border rounded-md p-3 hover:bg-accent cursor-pointer transition-all relative group', props.active ? 'bg-accent' : '')"
        >
        <div class="w-full relative line-clamp-1">
            {{ props.info.name }}
        </div>
        <div class="flex-shrink-0 text-sm text-muted-foreground overflow-hidden flex items-center justify-between">
            <div class="flex-1 text-ellipsis text-nowrap overflow-hidden">{{ props.info.mode }}</div>
            <div class="flex-shrink-0">{{ parseTimeAgo(props.info.create_at) }}</div>
        </div>
        <Popover>
            <PopoverTrigger asChild
                class="opacity-0 absolute top-2 right-2 size-4 text-muted-foreground hover:text-red-500 transition-all group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z">
                    </path>
                </svg>
            </PopoverTrigger>
            <PopoverContent side="top" :sideOffset="4" align="center">
                <div class="">确定要删除此会话吗？</div>
                <div class="flex items-center justify-end gap-2 mt-2">
                    <PopoverClose asChild>
                        <Button variant="outline" size="sm">取消</Button>
                    </PopoverClose>
                    <Button variant="destructive" size="sm">删除</Button>
                </div>
            </PopoverContent>
        </Popover>
    </div>
</template>

<script setup lang="ts" name="sessionItem">
import {
    Popover,
    PopoverContent,
    PopoverTrigger, PopoverClose

} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { SessionItem } from '@/types/interface';
import { cn, parseTimeAgo } from '@/lib/utils';

const props = defineProps<{
    info: SessionItem
    active?: boolean
}>()
</script>