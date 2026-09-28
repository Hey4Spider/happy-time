<template>
    <ComTable
        ref="refTable"
        :data="data"
        op-width="200"
        :reset="false"
        :search="false"
        op-label="操作"
    >
        <template #filter>
            <ElSelect v-model="status" clearable @change="onStatusChange">
                <ElOption
                    v-for="item of StatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </ElSelect>
        </template>

        <ElTableColumn label="名称" prop="name" />
        <ElTableColumn label="状态" width="90">
            <template #default="{ row }">
                <ElTag
                    v-if="StatusMap[row.status]"
                    :type="StatusMap[row.status].type"
                >
                    {{ StatusMap[row.status].label }}
                </ElTag>
            </template>
        </ElTableColumn>

        <template #operation="{ row }">
            <template v-for="action of OperationActions" :key="action.key">
                <ElIcon
                    v-if="!action.visible || action.visible(row)"
                    size="24"
                    :class="action.color"
                    @click="action.click(row)"
                >
                    <component :is="action.icon" />
                </ElIcon>
            </template>
        </template>
    </ComTable>
</template>

<script setup lang="ts">
import ComTable from '@/components/Table.vue'
import { ResourceStatus, RespMisskon } from '@/utils'
import {
    ChromeFilled,
    DeleteFilled,
    Link,
    QuestionFilled,
    SuccessFilled,
} from '@element-plus/icons-vue'
import { ElIcon, ElOption, ElSelect, ElTableColumn, ElTag } from 'element-plus'
import { useTemplateRef, type Component } from 'vue'
import { StatusMap, StatusOptions } from './util'

const OperationActions: {
    key: string
    icon: Component
    color: string
    visible?: (row: RespMisskon) => boolean
    click: (row: RespMisskon) => void
}[] = [
    {
        key: 'link',
        icon: Link,
        color: 'color-info',
        visible: row => !/part\d/.test(row.link),
        click: row => onClick(row.link),
    },
    {
        key: 'url',
        icon: ChromeFilled,
        color: 'color-info',
        click: row => onClick(row.url),
    },
    {
        key: 'downloaded',
        icon: SuccessFilled,
        color: 'color-success',
        click: row => onMark(row.id, ResourceStatus.Downloaded),
    },
    {
        key: 'can-download',
        icon: QuestionFilled,
        color: 'color-info',
        click: row => onMark(row.id, ResourceStatus.CanDownload),
    },
    {
        key: 'failed',
        icon: DeleteFilled,
        color: 'color-danger',
        click: row => onMark(row.id, ResourceStatus.Failed),
    },
]

const status = defineModel<ResourceStatus>('status')
const refTable = useTemplateRef('refTable')
defineProps<{
    data: RespMisskon[]
}>()
const emits = defineEmits<{
    update: [id: number, status: ResourceStatus]
    'status-change': [status: ResourceStatus]
}>()

function onStatusChange(value = ResourceStatus.All) {
    status.value = value
    emits('status-change', value)
}

function onClick(url: string) {
    window.open(url, '_blank')
}

function onMark(id: number, status: ResourceStatus) {
    emits('update', id, status)
}
</script>
