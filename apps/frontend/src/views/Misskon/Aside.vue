<template>
    <ElSelect
        v-model="status"
        placeholder="下载状态"
        clearable
        @change="onStatusChange"
    >
        <ElOption
            v-for="item of StatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
    </ElSelect>

    <ElScrollbar class="scrollbar">
        <ElMenu class="menu" :default-active="active" @select="onMenuChange">
            <ElMenuItem
                class="text-ellipsis"
                v-for="item of data"
                :key="item.name"
                :index="item.name"
            >
                {{ item.name }}
            </ElMenuItem>
        </ElMenu>
    </ElScrollbar>
</template>

<script setup lang="ts">
import {
    ElMenu,
    ElMenuItem,
    ElOption,
    ElScrollbar,
    ElSelect,
} from 'element-plus'
import { StatusOptions } from './util'
import { ResourceStatus, RespMisskonTag } from '@/utils'

const status = defineModel<ResourceStatus>('status')
defineProps<{
    data: RespMisskonTag[]
    active: string
}>()
const emits = defineEmits<{
    'status-change': [status?: ResourceStatus]
    'menu-change': [name: string]
}>()

function onStatusChange(value = ResourceStatus.All) {
    status.value = value
    emits('status-change', value)
}
function onMenuChange(name: string) {
    emits('menu-change', name)
}
</script>

<style scoped lang="scss">
.menu {
    width: 197px;
    height: 100vh;

    :deep(.el-sub-menu__title):hover,
    .el-menu-item:hover {
        color: var(--el-color-primary);
    }

    .el-sub-menu .el-menu-item:first-child {
        border-bottom: var(--el-border);
    }
    .el-sub-menu,
    .el-menu-item {
        border-bottom: var(--el-border);
    }
    .el-sub-menu.is-opened {
        border-bottom: none;
    }
}
.scrollbar {
    height: calc(100vh - 32px);
}
</style>
