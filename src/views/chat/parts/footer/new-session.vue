<template>
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button variant="outline" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                </svg>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>新建会话</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Prompt API</DropdownMenuItem>
            <DropdownMenuItem>Summarizer API</DropdownMenuItem>
            <DropdownMenuItem>Language Detector API</DropdownMenuItem>
            <DropdownMenuItem>Translator API</DropdownMenuItem>
            <DropdownMenuItem>Writer API</DropdownMenuItem>
            <DropdownMenuItem>Rewriter API</DropdownMenuItem>
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

import { Button } from '@/components/ui/button'
</script>

<style scoped lang="scss"></style>