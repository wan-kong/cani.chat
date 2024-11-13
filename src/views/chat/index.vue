<script setup lang="ts">
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import sessionPart from './parts/session/index.vue'
import footerPart from './parts/footer/index.vue'
import logoPart from './parts/Logo/index.vue'
import chatBox from './parts/chat-box/index.vue'
import inputBox from './parts/input-box/index.vue'

</script>

<template>
    <ResizablePanelGroup direction="horizontal" class="w-full rounded-lg border">
        <ResizablePanel :max-size="40" :min-size="18" :default-size="18">
            <div class="flex h-full flex-col">
                <logoPart></logoPart>
                <sessionPart></sessionPart>
                <footerPart></footerPart>
            </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
                <ResizablePanel :max-size="86" :default-size="86">
                    <chatBox></chatBox>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    <inputBox></inputBox>
                </ResizablePanel>
            </ResizablePanelGroup>
        </ResizablePanel>
    </ResizablePanelGroup>
</template>
