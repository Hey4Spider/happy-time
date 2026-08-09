<template>
    <ElSelect
        v-model="status"
        placeholder="下载状态"
        clearable
        @change="onSelect"
    >
        <ElOption
            v-for="item of StatusOptions"
            :key="item.value"
            v-bind="item"
        />
    </ElSelect>

    <ElScrollbar class="scrollbar">
        <ElMenu class="menu" :default-active="active" @select="onMenu">
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
import { ResourceStatus } from '@shared'
import {
    ElMenu,
    ElMenuItem,
    ElOption,
    ElScrollbar,
    ElSelect,
} from 'element-plus'
import { computed } from 'vue'
import { StatusOptions } from './util'
import { RespMisskonTag } from '@/utils'
import { useRoute } from 'vue-router'

const status = defineModel<ResourceStatus>('status')
const props = defineProps<{
    data: RespMisskonTag[]
}>()
const emits = defineEmits<{
    (e: 'status', status?: ResourceStatus): void
    (e: 'menu', value: string): void
}>()
const route = useRoute()

const active = computed(() => {
    const def = props.data[0]?.name || ''
    const hash = decodeURIComponent(route.hash || def).slice(1)
    const item = props.data.find(item => item.name === hash)
    if (item) {
        return item.name
    } else {
        return def
    }
})

function onSelect(value: ResourceStatus) {
    emits('status', value)
}
function onMenu(name: string) {
    emits('menu', name)
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
