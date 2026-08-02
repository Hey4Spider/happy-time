<template>
    <ElDialog v-model="show" title="批量删除" @close="onClose">
        <ElForm :model="form" label-width="70">
            <ElFormItem label="删除至" prop="to">
                <ElSelect
                    v-model="form.to"
                    :disabled="!!form.count"
                    clearable
                    placeholder="请选择删除到某个资源"
                    filterable
                    :filter-method="onFilter"
                >
                    <ElOption
                        v-for="item of _list"
                        :key="item.path"
                        :value="item.name"
                        :label="item.name"
                    />
                </ElSelect>
            </ElFormItem>
            <ElFormItem label="删除数量" prop="count">
                <ElInputNumber
                    v-model="form.count"
                    :disabled="!!form.to"
                    :min="1"
                    :max="_list.length"
                    step-strictly
                    :controls="false"
                    placeholder="请输入删除数量"
                    align="left"
                />
            </ElFormItem>
        </ElForm>

        <template #footer>
            <ElButton type="primary" @click="onConfirm">确定</ElButton>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
import { RespResource } from '@/utils'
import {
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInputNumber,
    ElMessage,
    ElOption,
    ElSelect,
} from 'element-plus'
import { reactive, ref, shallowRef } from 'vue'

const props = defineProps<{
    list: RespResource[]
}>()
const emits = defineEmits<{
    batch: [item: RespResource, index: number, count: number]
}>()

const show = ref(false)
const _index = ref(0)
const _list = shallowRef<RespResource[]>([])

const form = reactive<{
    to?: string
    count?: number
}>({})

function open(index: number) {
    show.value = true
    _index.value = index
    _initList()
}

function onFilter(value: string) {
    if (value) {
        _list.value = [...props.list.filter(item => item.name.includes(value))]
    } else {
        _initList()
    }
}

function onConfirm() {
    let tarIdx = _index.value
    let tarItem = props.list[_index.value]!
    let count: number
    if (form.count) {
        count = form.count
    } else {
        const idx = props.list.findIndex(item => item.name === form.to)
        if (idx === -1 || idx === _index.value) {
            return ElMessage.error('无效的索引')
        } else if (idx < _index.value) {
            count = _index.value - idx + 1
        } else {
            tarItem = props.list[idx]!
            tarIdx = idx
            count = idx - _index.value + 1
        }
    }
    emits('batch', tarItem, tarIdx, count)
    show.value = false
}

function onClose() {
    delete form.to
    delete form.count
}

function _initList() {
    _list.value = [...props.list.slice(0, _index.value + 1)]
}

defineExpose({
    open,
})
</script>

<style lang="scss" scoped></style>
