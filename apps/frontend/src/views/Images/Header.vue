<template>
    <ElSelect class="workspace" v-model="store.Workspace" @change="onChange">
        <ElOption
            v-for="item of list"
            :key="item.key"
            :value="item.key"
            :disabled="!item.isActive"
        >
            {{ item.key }}
        </ElOption>
    </ElSelect>

    <div class="path">
        <template v-for="(item, index) of paths" :key="item">
            <div class="hover path-item" @click="onClick(item, index)">
                {{ item }}
            </div>
            <div class="split" v-if="index < paths.length - 1">/</div>
        </template>
        <span v-if="count" style="padding-left: 10px">({{ count }} 项)</span>
    </div>

    <div class="flex-center operation">
        <ElButton type="danger" @click="onRemove">删除</ElButton>
        <ComSetting />
        <ComHelper />
    </div>
</template>

<script setup lang="ts">
import ComHelper from './Helper.vue'
import ComSetting from './Setting.vue'
import { RespWorkspace } from '@/utils'
import { ElButton, ElOption, ElSelect } from 'element-plus'
import { computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from './store.js'

const route = useRoute()
const emits = defineEmits<{
    workspace: [value: string]
    folder: [value?: string]
    remove: []
}>()
defineProps<{
    list: RespWorkspace[]
    count?: number
}>()

const store = useStore()

const paths = computed(() => {
    const hash = route.hash?.slice(1)
    const list = ['首页']
    if (hash) {
        list.push(...hash.split('/'))
    }
    return list
})

function onChange(value: string) {
    nextTick(() => emits('workspace', value))
}

function onClick(value: string, index: number) {
    emits('folder', paths.value.slice(1, index + 1).join('/') || undefined)
}

function onRemove() {
    emits('remove')
}
</script>

<style lang="scss" scoped>
.workspace {
    width: 130px;
    margin-right: 10px;
}

.path {
    display: flex;
    margin-right: auto;
    .split {
        margin: 0 10px;
    }
    .path-item:last-of-type {
        cursor: auto;
        color: var(--el-text-color-primary);
    }
}

.operation {
    gap: 10px;
}
</style>
