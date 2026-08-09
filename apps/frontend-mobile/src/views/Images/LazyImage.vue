<template>
    <div class="image-wrap flex-center" ref="refWrap" v-if="data.isImage">
        <ElImage
            v-if="show"
            class="image"
            :src="`${imageFolder}/${data.path}`"
            fit="scale-down"
        />
    </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores'
import { ImageItem } from '@/utils'
import { ElImage } from 'element-plus'
import {
    computed,
    onBeforeMount,
    onMounted,
    ref,
    useTemplateRef,
    watch,
} from 'vue'

const Store = useGlobalStore()

const imageFolder = computed(() => {
    return import.meta.env.VITE_SERVER_URL + '/' + Store.Workspace
})

const props = defineProps<{
    data: ImageItem
    scrollbarWrap?: HTMLDivElement
    margin?: number
}>()

let observer: IntersectionObserver | null = null

const refWrap = useTemplateRef('refWrap')
const show = ref(false)
const margin = computed(() => {
    return props.margin || window.innerHeight * 10
})

function disconnect() {
    observer?.disconnect()
    observer = null
}

function observe() {
    disconnect()

    if (!refWrap.value || show.value) {
        return
    }

    observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry?.isIntersecting) {
                return
            }
            show.value = true
            disconnect()
        },
        {
            root: props.scrollbarWrap,
            rootMargin: `${margin.value}px 0`,
            threshold: 0.01,
        },
    )
    observer.observe(refWrap.value)
}

onMounted(observe)
watch(() => props.scrollbarWrap, observe)
onBeforeMount(disconnect)
</script>

<style scoped lang="scss">
.image-wrap {
    height: calc(100svh - 150px);
    width: 100%;
    border-bottom: var(--el-border);
    box-sizing: border-box;
}
.image {
    height: 100%;
}
</style>
