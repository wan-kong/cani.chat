<script setup lang="ts">
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import sessionPart from './parts/session/index.vue'
import footerPart from './parts/footer/index.vue'
import logoPart from './parts/Logo/index.vue'

</script>

<template>
    <ResizablePanelGroup direction="horizontal" class="w-full rounded-lg border">
        <ResizablePanel :max-size="40" :min-size="20" :default-size="20">
            <div class="flex h-full flex-col">
                <logoPart></logoPart>
                <sessionPart></sessionPart>
                <footerPart></footerPart>
            </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
                <ResizablePanel :max-size="90" :default-size="70">
                    <div class="flex h-full items-center justify-center p-6">
                        <span class="font-semibold">Chat List</span>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    <div class="flex h-full items-center justify-center p-6">
                        <span class="font-semibold">UserInput</span>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </ResizablePanel>
    </ResizablePanelGroup>
</template>

<style scoped></style>
