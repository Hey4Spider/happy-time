<template>
    <ElPopover width="400" trigger="click" v-model:visible="show">
        <template #reference>
            <ElIcon class="hover help-icon" @mouseleave="show = false">
                <QuestionFilled />
            </ElIcon>
        </template>

        <ElDescriptions border :column="1">
            <ElDescriptionsItem
                v-for="item of helper"
                :key="item.label"
                :label="item.label"
            >
                {{ item.value }}
            </ElDescriptionsItem>
        </ElDescriptions>
    </ElPopover>
</template>

<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import {
    ElDescriptions,
    ElDescriptionsItem,
    ElIcon,
    ElPopover,
} from 'element-plus'
import { ref } from 'vue'

const helper = [
    { label: '删除操作' },
    { label: 'Shift + Click', value: '删除点击目标之前的图片' },
    { label: 'Shift + Meta + Click', value: '根据点击目标进行批量删除' },
    { label: 'Shift + Del', value: '删除当前目录' },
    { label: 'Shift + Z', value: '撤销删除' },
    { label: 'Shift + K', value: '清空回收站' },
    { label: '目录操作' },
    { label: 'Shift + Up', value: '上一个目录' },
    { label: 'Shift + Down', value: '下一个目录' },
    { label: 'Shift + Left', value: '父级目录' },
    { label: '系统操作' },
    { label: 'Shift + O', value: '打开当前目录' },
    { label: 'Shift + T', value: '打开回收站' },
]

const show = ref(false)
</script>

<style scoped>
.help-icon {
    font-size: 24px;
    color: var(--el-text-color-primary);
}
</style>
