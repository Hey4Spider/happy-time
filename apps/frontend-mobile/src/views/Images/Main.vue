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

    <ElScrollbar ref="refScrollbar" height="calc(100svh - 100px)">
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
            <ComLazyImage :data="item" :scrollbar-wrap="refScrollbarWrap" />
        </div>
    </ElScrollbar>
</template>

<script setup lang="ts">
import ComLazyImage from './LazyImage.vue'
import ButtonLongPress from '@/components/ButtonLongPress.vue'
import { ImageItem, RespResource, VueProps } from '@/utils'
import { ElButton, ElScrollbar } from 'element-plus'
import { nextTick, onMounted, ref, useTemplateRef } from 'vue'

interface ButtonData {
    item: ImageItem
    index: number
}

const ButtonAttrs: VueProps<typeof ElButton> = {
    size: 'small',
    type: 'danger',
}

defineProps<{
    list: ImageItem[]
}>()
const emits = defineEmits<{
    remove: [item: RespResource, index: number, count?: number]
    removeFolder: []
    changeFolder: [type: 'prev' | 'next']
}>()
const refScrollbar = useTemplateRef('refScrollbar')
const refScrollbarWrap = ref<HTMLDivElement>()

const ImageHeight = window.innerHeight - 100

onMounted(async () => {
    await nextTick()
    refScrollbarWrap.value = refScrollbar.value?.wrapRef
})

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

function onRemove({ item, index }: ButtonData) {
    emits('remove', item, index)
}

function scrollToTop() {
    refScrollbar.value?.scrollTo({
        left: 0,
        top: 0,
        behavior: 'instant',
    })
}

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
.operation {
    justify-content: space-between;
    height: 50px;
    padding: 0 20px;
    border-bottom: var(--el-border);
}
</style>
