<template>
    <div class="flex-center operation">
        <ElButton type="success" size="small" @click="onChangeFolder('prev')">
            上一组
        </ElButton>
        <ElButton
            class="op-remove"
            size="small"
            type="danger"
            @click="onFolderRemove"
        >
            删除目录
        </ElButton>
        <ElButton type="success" size="small" @click="onChangeFolder('next')">
            下一组
        </ElButton>
    </div>

    <ElScrollbar
        ref="refScrollbar"
        height="calc(100svh - 100px)"
        @scroll="onScroll"
    >
        <div v-for="(item, index) of list" :key="item.path">
            <div class="image-header">
                <div class="image-name text-ellipsis">
                    {{ item.name }} ({{ item.size }})
                </div>
                <ButtonLongPress
                    :data="{ item, index }"
                    :button-attrs="ButtonAttrs"
                    @click="onRemove"
                    @long-press="onLongPress"
                >
                    删除
                </ButtonLongPress>
            </div>
            <div class="image-wrap flex-center" v-if="item.isImage">
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
import ButtonLongPress from '@/components/ButtonLongPress.vue'
import { useGlobalStore } from '@/stores'
import { ImageItem, RespResource, VueProps } from '@/utils'
import { sleep } from '@shared'
import { ElButton, ElImage, ElScrollbar } from 'element-plus'
import { computed, reactive, useTemplateRef, watch } from 'vue'

interface ButtonData {
    item: ImageItem
    index: number
}

const ButtonAttrs: VueProps<typeof ElButton> = {
    size: 'small',
    type: 'danger',
}

const Store = useGlobalStore()

const imageFolder = computed(() => {
    return import.meta.env.VITE_SERVER_URL + '/' + Store.Workspace
})

const props = defineProps<{
    list: ImageItem[]
}>()
const emits = defineEmits<{
    remove: [item: RespResource, index: number, count?: number]
    removeFolder: []
    changeFolder: [type: 'prev' | 'next']
}>()
const btnRefMap = reactive({})
const refScrollbar = useTemplateRef('refScrollbar')

const ImageHeight = window.innerHeight - 100

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
async function onRemove({ item, index }: ButtonData) {
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

let currTop = 0
const topThreshold = ImageHeight / 3
function onScroll({ scrollTop }) {
    currTop = scrollTop
}
// MARK: 删除后, 自动对焦到下一个按钮
watch(
    () => props.list.length,
    async () => {
        await sleep(100)
        const remaining = currTop % ImageHeight
        if (remaining === 0 || remaining > topThreshold) {
            // 只有按钮在 1/3 高度时才聚焦
            btnRefMap[nextPath]?.ref.focus()
        }
    },
)

defineExpose({
    changeImage,
    scrollToTop,
})

function onFolderRemove() {
    emits('removeFolder')
}

function onChangeFolder(type: 'prev' | 'next') {
    emits('changeFolder', type)
}

function onLongPress({ item, index }: ButtonData) {
    emits('remove', item, index, index + 1)
}
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
    padding-right: 10px;
}
.image-wrap {
    height: calc(100svh - 150px);
    width: 100%;
    border-bottom: var(--el-border);
    box-sizing: border-box;
}
.image {
    height: 100%;
}
.operation {
    justify-content: space-between;
    height: 50px;
    padding: 0 20px;
    border-bottom: var(--el-border);
}
</style>
