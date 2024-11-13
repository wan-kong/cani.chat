<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button variant="outline" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 3.311L4.5 7.65311V16.3469L12 20.689L19.5 16.3469V7.65311L12 3.311ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z">
                    </path>
                </svg></Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end">
            <div>
                some setting here
            </div>
            <div class="w-full flex items-center justify-end gap-2 mt-2">
                <PopoverClose as-child>
                    <Button variant="secondary">取消</Button>
                </PopoverClose>
                <Button>保存</Button>
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts" name="chartSetting">
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverTrigger,
    PopoverClose,
    PopoverContent
} from '@/components/ui/popover'

</script>

<style scoped lang="scss"></style>