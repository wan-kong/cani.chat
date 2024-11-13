<template>
    <div class="flex-1 h-0 flex flex-col overflow-hidden">
        <div class="relative w-full items-center px-2 mt-1">
            <Input type="text" placeholder="搜索" v-model="filterKey" class="px-8" />
            <span class="absolute start-4 inset-y-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4 text-muted-foreground"
                    fill="currentColor">
                    <path
                        d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z">
                    </path>
                </svg>
            </span>
            <span class="absolute end-4 inset-y-0 items-center justify-center cursor-pointer"
                :class="filterKey.length ? 'flex' : 'hidden'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4 text-muted-foreground"
                    fill="currentColor">
                    <path
                        d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z">
                    </path>
                </svg>
            </span>
        </div>
        <ScrollArea class="flex flex-col px-2 mt-2 gap-2">
            <sessionItem v-for="item in 10" :key="item"></sessionItem>
        </ScrollArea>
    </div>
</template>

<script setup lang="ts" name="sessionPart">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import sessionItem from './session-item.vue'
import { ScrollArea } from '@/components/ui/scroll-area';

const filterKey = ref('')

</script>