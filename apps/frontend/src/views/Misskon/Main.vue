<template>
    <ElTable
        :data="data"
        stripe
        border
        height="calc(100vh - 40px)"
        size="default"
    >
        <ElTableColumn label="名称" prop="name" />
        <ElTableColumn label="操作" width="175" class-name="table-operation">
            <template #default="{ row }">
                <ElIcon
                    v-if="!/part\d/.test(row.link)"
                    size="24"
                    color="#67C23A"
                    @click="onClick(row.link)"
                >
                    <Link />
                </ElIcon>
                <ElIcon
                    size="24"
                    color="#67C23A"
                    @click="onMark(row.id, ResourceStatus.Downloaded)"
                >
                    <SuccessFilled />
                </ElIcon>
                <ElIcon
                    size="24"
                    color="#909399"
                    @click="onMark(row.id, ResourceStatus.CanDownload)"
                >
                    <QuestionFilled />
                </ElIcon>
            </template>
        </ElTableColumn>
    </ElTable>
</template>

<script setup lang="ts">
import { ResourceStatus, RespMisskon } from '@/utils'
import { Link, QuestionFilled, SuccessFilled } from '@element-plus/icons-vue'
import { ElIcon, ElTable, ElTableColumn } from 'element-plus'

defineProps<{
    data: RespMisskon[]
}>()
const emits = defineEmits<{
    update: [id: number, status: ResourceStatus]
}>()

function onClick(url: string) {
    window.open(url, '_blank')
}

function onMark(id: number, status: ResourceStatus) {
    emits('update', id, status)
}
</script>

<style scoped lang="scss">
:deep() {
    .table-operation {
        .cell {
            display: flex;
            .el-icon + .el-icon {
                margin-left: 5%;
            }
        }
    }
}
</style>
