<template>
    <ElScrollbar ref="refScrollbar" height="calc(100vh - 50px)">
        <div v-for="(item, index) of list" :key="item.path">
            <div class="image-header">
                <div class="image-name">{{ item.name }}</div>
                <ElButton
                    type="danger"
                    :ref="el => setBtnRef(el, item.path)"
                    @click="onRemove(item, index)"
                >
                    删除
                </ElButton>
            </div>
            <div class="image-wrap flex-center">
                <ElImage
                    class="image"
                    :src="`${imageFolder}/${item.path}`"
                    fit="scale-down"
                />
            </div>
        </div>
    </ElScrollbar>
</template>

<script setup lang="ts">
import { useStore } from '@/stores'
import { RespResource } from '@/utils'
import { sleep } from '@shared'
import { ElButton, ElImage, ElScrollbar } from 'element-plus'
import {
    ComponentPublicInstance,
    computed,
    reactive,
    useTemplateRef,
    watch,
} from 'vue'

const { Workspace } = useStore()

const imageFolder = computed(() => {
    return import.meta.env.VITE_SERVER_URL + '/' + Workspace.value
})

const props = defineProps<{
    list: RespResource[]
}>()
const emits = defineEmits<{
    remove: [item: RespResource, index: number]
}>()
const btnRefMap = reactive({})
const refScrollbar = useTemplateRef('refScrollbar')

const ImageHeight = window.innerHeight - 50

function changeImage(type: 'next' | 'prev') {
    const top = refScrollbar.value?.wrapRef?.scrollTop || 0
    let idx = Math.floor(top / ImageHeight)
    idx += type === 'next' ? 1 : -1
    refScrollbar.value?.scrollTo({
        left: 0,
        top: Math.max(0, idx * ImageHeight),
        behavior: 'instant',
    })
}

let nextPath: string
async function onRemove(item: RespResource, index: number) {
    nextPath = props.list[index + 1]?.path || ''
    emits('remove', item, index)
}

function scrollToTop() {
    refScrollbar.value?.scrollTo({
        left: 0,
        top: 0,
        behavior: 'instant',
    })
}

function setBtnRef(el: Element | ComponentPublicInstance | null, key: string) {
    if (el) {
        btnRefMap[key] = el
    } else {
        delete btnRefMap[key]
    }
}
// MARK: 删除后, 自动对焦到下一个按钮
watch(
    () => props.list.length,
    async () => {
        await sleep(100)
        btnRefMap[nextPath]?.ref.focus()
    },
)

defineExpose({
    changeImage,
    scrollToTop,
})
</script>

<style scoped lang="scss">
.image-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 10px;
    border-bottom: var(--el-border);
    box-sizing: border-box;
}
.image-name {
    width: 100%;
    padding-right: 10px;
    overflow: hidden; /* 隐藏溢出内容 */
    text-overflow: ellipsis; /* 溢出时显示省略号 */
    white-space: nowrap;
    direction: rtl;
    text-align: left;
}
.image-wrap {
    height: calc(100vh - 100px);
    width: 100%;
    border-bottom: var(--el-border);
    box-sizing: border-box;
}
.image {
    height: 100%;
}
</style>
