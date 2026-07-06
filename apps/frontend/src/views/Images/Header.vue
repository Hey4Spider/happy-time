<template>
    <ElSelect class="workspace" v-model="Store.Workspace" @change="onChange">
        <ElOption
            v-for="item of list"
            :key="item.key"
            :value="item.key"
            :disabled="!item.isActive"
        >
            {{ item.key }}
        </ElOption>
    </ElSelect>

    <div class="path">
        <template v-for="(item, index) of paths" :key="item">
            <div class="hover path-item" @click="onClick(item, index)">
                {{ item }}
            </div>
            <div class="split" v-if="index < paths.length - 1">/</div>
        </template>
    </div>

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
import { useGlobalStore } from '@/stores'
import { RespWorkspace } from '@/utils'
import { QuestionFilled } from '@element-plus/icons-vue'
import {
    ElDescriptions,
    ElDescriptionsItem,
    ElIcon,
    ElOption,
    ElPopover,
    ElSelect,
} from 'element-plus'
import { computed, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const emits = defineEmits<{
    workspace: [value: string]
    folder: [value?: string]
}>()
defineProps<{
    list: RespWorkspace[]
}>()

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

const Store = useGlobalStore()

const show = ref(false)

const paths = computed(() => {
    const hash = route.hash?.slice(1)
    const list = ['首页']
    if (hash) {
        list.push(...hash.split('/'))
    }
    return list
})

function onChange(value: string) {
    nextTick(() => emits('workspace', value))
}

function onClick(value: string, index: number) {
    emits('folder', paths.value.slice(1, index + 1).join('/') || undefined)
}
</script>

<style lang="scss" scoped>
.workspace {
    width: 130px;
    margin-right: 10px;
}

.path {
    display: flex;
    .split {
        margin: 0 10px;
    }
    .path-item:last-of-type {
        cursor: auto;
        color: var(--el-text-color-primary);
    }
}

.help-icon {
    margin-left: auto;
    font-size: 24px;
    color: var(--el-text-color-primary);
}
</style>
