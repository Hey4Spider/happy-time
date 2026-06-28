<template>
    <ElForm v-bind="BindFilter" class="com-filter" @submit.prevent>
        <slot />

        <ElFormItem>
            <slot name="before-operation" />
            <ElButton v-if="reset" @click="onReset">重置</ElButton>
            <ElButton
                v-if="search"
                type="primary"
                native-type="submit"
                @click="onSearch"
            >
                查询
            </ElButton>
            <slot name="after-operation" />
        </ElFormItem>
    </ElForm>
</template>

<script setup lang="ts">
import { VueProps } from '@/utils'
import { ElButton, ElForm, ElFormItem } from 'element-plus'

export interface Props {
    reset?: boolean
    search?: boolean
}

const emits = defineEmits(['reset', 'search'])
withDefaults(defineProps<Props>(), {
    reset: true,
    search: true,
})

const BindFilter: VueProps<typeof ElForm> = {
    inline: true,
    labelWidth: 80,
    labelPosition: 'left',
}

const onReset = () => emits('reset')
const onSearch = () => emits('search')
</script>

<style lang="scss" scoped>
.com-filter:deep() {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 10px;

    .el-form-item:last-child {
        grid-column: 4;
        margin-left: auto;
    }

    .el-form-item {
        margin: 0;
    }
}
</style>
