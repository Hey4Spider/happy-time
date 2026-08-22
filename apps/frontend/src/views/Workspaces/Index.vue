<template>
    <div class="flex operation">
        <ElButton type="primary" @click="showDialog()">创建</ElButton>
    </div>
    <ComTable :data="list" op-width="100">
        <ElTableColumn label="Key" prop="key" width="150" />
        <ElTableColumn label="Path" prop="path" />
        <ElTableColumn label="Trash" prop="trash" />

        <template #operation="{ row }">
            <ElIcon @click="showDialog(row)">
                <Edit />
            </ElIcon>
            <ElIcon class="color-danger" @click="onDelete(row.key)">
                <Delete />
            </ElIcon>
        </template>
    </ComTable>

    <ComDialog v-model:show="show" :data="targetData" @confirm="onComfirm" />
</template>

<script lang="ts" setup>
import ComTable from '@com/Table.vue'
import ComDialog from './Dialog.vue'
import { apis, RespWorkspace } from '@/utils'
import { ElButton, ElIcon, ElTableColumn } from 'element-plus'
import { onMounted, ref, shallowRef } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'

onMounted(listWorkspace)

const show = ref(false)
const list = shallowRef<RespWorkspace[]>([])
const targetData = shallowRef<Partial<RespWorkspace>>()

async function listWorkspace() {
    const res = await apis.Workspaces.listWorkspace()
    list.value = res.data.list
}

function showDialog(data?: RespWorkspace) {
    targetData.value = data
    show.value = true
}

function onComfirm(type: 'create' | 'update', data: RespWorkspace) {
    const _list = [...list.value]
    if (type === 'create') {
        _list.push(data)
        _list.sort((a, b) => (a.key > b.key ? 1 : -1))
    } else {
        const idx = _list.findIndex(item => item.key === data.key)
        _list[idx] = data
    }
    list.value = _list
}

async function onDelete(key: string) {
    await apis.Workspaces.removeWorkspace({ key })
    const _list = [...list.value]
    const idx = _list.findIndex(item => item.key === key)
    _list.splice(idx, 1)
    list.value = _list
}
</script>

<style scoped lang="scss">
.operation {
    width: 100%;
    margin-bottom: 10px;

    .el-button {
        margin-left: auto;
    }
}
</style>
