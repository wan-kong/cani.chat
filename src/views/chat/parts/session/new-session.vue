<template>
    <DropdownMenu>
        <DropdownMenuTrigger class="mt-2 px-2 w-full">
            <Button variant="outline" class="w-full" title="新建会话">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                </svg>
                新建会话
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" :side-offset="-2">
            <DropdownMenuLabel>请选择会话对象</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem v-for="item in modeList" @click="handleNewSession(item.mode)" :disabled="item.disabled">
                <div class="w-full">
                    {{ item.name }}
                </div>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup lang="tsx" name="newSession">
import { modeList } from '@/config/mode'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useGlobalState } from '@/lib/store';

const store = useGlobalState()

const handleNewSession = (mode: AIModel) => {
    store.addSession('新会话', mode)

}
</script>
