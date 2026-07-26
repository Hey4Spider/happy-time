<template>
    <ElDrawer
        v-model="show"
        direction="btt"
        size="80%"
        :with-header="false"
        lock-scroll
    >
        <ElScrollbar height="100%">
            <div
                v-for="item of folderList"
                class="folder-item"
                :key="item.path"
                @click="onClick(item)"
            >
                {{ item.name }}
            </div>
        </ElScrollbar>
    </ElDrawer>
</template>

<script setup lang="ts">
import { RespResource } from '@/utils'
import { ElDrawer, ElScrollbar } from 'element-plus'
import { watch } from 'vue'

const show = defineModel<boolean>('show')
const emits = defineEmits<{
    change: [item: RespResource]
}>()
const props = defineProps<{
    folderList: RespResource[]
}>()
function onClick(item: RespResource) {
    emits('change', item)
}
watch(
    () => props.folderList,
    list => {
        if (list.length === 0) {
            show.value = false
        }
    },
)
</script>

<style scoped lang="scss">
.folder-item {
    border-top: var(--el-border);
    padding: 10px;
}
.folder-item:last-child {
    border-bottom: var(--el-border);
}
</style>
