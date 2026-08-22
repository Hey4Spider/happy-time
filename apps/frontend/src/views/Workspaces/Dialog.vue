<template>
    <ElDialog
        v-model="show"
        :title="title"
        :show-close="false"
        @open="onOpen"
        @close="onClose"
    >
        <ElForm
            label-width="60"
            label-position="left"
            :model="formData"
            @keyup.enter="onConfirm"
        >
            <ElFormItem label="Key" required>
                <ElInput v-model="formData.key" :disabled="!!data?.key" />
            </ElFormItem>
            <ElFormItem label="Path" required>
                <ElInput v-model="formData.path" />
            </ElFormItem>
            <ElFormItem label="Trash" required>
                <ElInput v-model="formData.trash" />
            </ElFormItem>

            <ElFormItem>
                <ElButton @click="show = false">取消</ElButton>
                <ElButton type="primary" @click="onConfirm">提交</ElButton>
            </ElFormItem>
        </ElForm>
    </ElDialog>
</template>

<script lang="ts" setup>
import { apis, CreateWorkspaceDto, RespWorkspace } from '@/utils'
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus'
import { computed, reactive } from 'vue'

const show = defineModel<boolean>('show')
const props = defineProps<{
    data?: Partial<RespWorkspace>
}>()

const title = computed(() => {
    return props.data?.key ? '更新' : '创建'
})

const emits = defineEmits<{
    confirm: [type: 'create' | 'update', data: RespWorkspace]
}>()

const formData = reactive<Partial<CreateWorkspaceDto>>({})

async function onConfirm() {
    if (props.data?.key) {
        const { data } = await apis.Workspaces.updateWorkspace(
            { key: props.data.key },
            { ...(formData as any) },
        )
        emits('confirm', 'update', data)
    } else {
        const { data } = await apis.Workspaces.createWorkspcae({
            ...(formData as any),
        })
        emits('confirm', 'create', data)
    }
    show.value = false
}

function onOpen() {
    formData.key = props.data?.key
    formData.path = props.data?.path
    formData.trash = props.data?.trash
}

function onClose() {
    formData.key = ''
    formData.path = ''
    formData.trash = ''
}
</script>
