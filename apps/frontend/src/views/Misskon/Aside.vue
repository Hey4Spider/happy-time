<template>
    <ElAffix>
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
    </ElAffix>

    <ElMenu :default-active="active" @select="onMenu">
        <ElMenuItem v-for="item of data" :key="item.name" :index="item.name">
            {{ item.name }}
        </ElMenuItem>
    </ElMenu>
</template>

<script setup lang="ts">
import { ResourceStatus } from '@shared'
import { ElAffix, ElMenu, ElMenuItem, ElOption, ElSelect } from 'element-plus'
import { computed, ref } from 'vue'
import { StatusOptions } from './util'
import { RespMisskonTag } from '@/utils'
import { useRoute } from 'vue-router'

const props = defineProps<{
    data: RespMisskonTag[]
}>()
const emits = defineEmits<{
    (e: 'status', status?: ResourceStatus): void
    (e: 'menu', value: string): void
}>()
const route = useRoute()

const status = ref<ResourceStatus>()
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
