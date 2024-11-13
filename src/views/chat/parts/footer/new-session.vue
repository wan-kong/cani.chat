<template>
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button variant="outline" size="icon" title="新建会话">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                </svg>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>新建会话</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="handleNewSession">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            Prompt API
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add to library</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleNewSession">Summarizer API</DropdownMenuItem>
            <DropdownMenuItem @click="handleNewSession">Language Detector API</DropdownMenuItem>
            <DropdownMenuItem @click="handleNewSession">Translator API</DropdownMenuItem>
            <DropdownMenuItem @click="handleNewSession">Writer API</DropdownMenuItem>
            <DropdownMenuItem @click="handleNewSession">Rewriter API</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup lang="ts" name="newSession">

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { useGlobalState } from '@/lib/store';
import { Model } from '@/types/interface';

const store = useGlobalState()


const handleNewSession = () => {
    store.addSession('新会话', Model.Prompt)
}
</script>
