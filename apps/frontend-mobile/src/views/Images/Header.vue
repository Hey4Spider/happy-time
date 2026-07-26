<template>
    <ElIcon class="back" size="24" @click="onBack"><Back /></ElIcon>

    <ElSelect
        class="workspace"
        size="small"
        v-model="Store.Workspace"
        @change="onChange"
    >
        <ElOption
            v-for="item of workspaceList"
            :key="item.key"
            :value="item.key"
            :disabled="!item.isActive"
        >
            {{ item.key }}
        </ElOption>
    </ElSelect>

    <div class="flex-center operation">
        <!-- <ElButton
            class="op-remove"
            size="small"
            type="danger"
            @click="onRemove"
        >
            删除
        </ElButton> -->
        <ElIcon size="24" @click="showFolder"><Menu /></ElIcon>
    </div>

    <ComFolder
        :folder-list="folderList"
        v-model:show="show"
        @change="onFolderChange"
    />
</template>

<script setup lang="ts">
import ComFolder from './Folder.vue'
import { useGlobalStore } from '@/stores'
import { RespResource, RespWorkspace } from '@/utils'
import { Back, Menu } from '@element-plus/icons-vue'
import { ElIcon, ElMessage, ElOption, ElSelect } from 'element-plus'
import { nextTick, ref, watch } from 'vue'

const emits = defineEmits<{
    workspace: [value: string]
    folder: [value?: string]
    // remove: []
    back: []
}>()
const props = defineProps<{
    workspaceList: RespWorkspace[]
    folderList: RespResource[]
    count?: number
}>()

const show = ref(false)

const Store = useGlobalStore()

function onChange(value: string) {
    nextTick(() => emits('workspace', value))
}

function onFolderChange(item: RespResource) {
    emits('folder', item.path)
}

function showFolder() {
    if (props.folderList.length) {
        show.value = true
    } else {
        ElMessage.info('目录为空')
    }
}

function onBack() {
    emits('back')
}

// function onRemove() {
//     emits('remove')
// }

watch(
    () => props.folderList.length,
    value => {
        if (value > 0 && props.count === 0) {
            show.value = true
        }
    },
)
watch(
    () => props.count,
    value => {
        if (value === 0 && props.folderList.length > 0) {
            show.value = true
        }
    },
)
</script>

<style lang="scss" scoped>
.workspace {
    width: 130px;
    margin-right: 10px;
}
.back {
    margin-right: 10px;
}
.operation {
    margin-left: auto;
}
.op-remove {
    margin-right: 10px;
}
</style>
