<template>
    <ElPopover width="200" trigger="click">
        <template #reference>
            <ElIcon class="hover setting-icon"><IconSetting /></ElIcon>
        </template>

        <ElForm class="setting">
            <ElFormItem label="滚动数量">
                <ElInputNumber
                    v-model="store.Config.multi"
                    v-bind="BindInputNumber"
                    :min="1"
                    :max="5"
                />
            </ElFormItem>
            <ElFormItem label="滚动延时">
                <ElInputNumber
                    v-model="store.Config.delay"
                    v-bind="BindInputNumber"
                    :min="50"
                    :max="200"
                />
            </ElFormItem>
            <ElFormItem label="自动滚动">
                <ElSwitch v-model="store.Config.auto" />
            </ElFormItem>
        </ElForm>
    </ElPopover>
</template>

<script setup lang="ts">
import IconSetting from '@com/SettingIcon.vue'
import {
    ElForm,
    ElFormItem,
    ElIcon,
    ElInputNumber,
    ElPopover,
    ElSwitch,
} from 'element-plus'
import { useStore } from './store'
import { VueProps } from '@/utils'

const BindInputNumber: VueProps<typeof ElInputNumber> = {
    stepStrictly: true,
    align: 'left',
    controls: false,
}

const store = useStore()
</script>

<style scoped lang="scss">
.setting:deep() {
    .el-form-item:last-child {
        margin-bottom: 0;
    }
}
.setting-icon {
    font-size: 24px;
    color: var(--el-text-color-primary);
}
</style>
