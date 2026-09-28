<template>
    <ElContainer class="app-container">
        <ElAside class="app-aside">
            <ComAside
                v-model:status="tagStatus"
                :data="tags"
                :active="activeName"
                @status-change="listTag"
                @menu-change="onMenuChange"
            />
        </ElAside>
        <ElMain class="misskon-main">
            <ComMain
                v-model:status="resStatus"
                ref="refMain"
                :data="misskons"
                @status-change="listMisskon"
                @update="onUpdate"
            />
        </ElMain>
    </ElContainer>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores'
import ComAside from './Aside.vue'
import ComMain from './Main.vue'
import router from '@/router/index.js'
import { apis, RespMisskon, RespMisskonTag } from '@/utils'
import { ResourceStatus } from '@shared'
import { useLocalStorage, useMagicKeys } from '@vueuse/core'
import { ElAside, ElContainer, ElMain } from 'element-plus'
import { computed, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'

interface TagNode {
    id: number
    name: string
    prev?: number
    next?: number
}

const GlobalStore = useGlobalStore()
const refMain = useTemplateRef('refMain')
const route = useRoute()

const tags = shallowRef<RespMisskonTag[]>([])
const tagStatus = useLocalStorage(
    'MISSKON_TAG_STATUS',
    ResourceStatus.Undownload,
)
const tagMap = computed(() => {
    const map: Recordable<TagNode> = {}
    const root: TagNode = {
        id: 0,
        name: '',
    }

    let curr = root
    for (const item of tags.value) {
        const node: TagNode = {
            id: item.id,
            name: item.name,
        }
        if (curr.id) {
            node.prev = curr.id
        }
        curr.next = node.id
        curr = node
        map[item.id] = node
    }
    return map
})

const misskons = shallowRef<RespMisskon[]>([])
const resStatus = useLocalStorage(
    'MISSKON_RESOURCE_STATUS',
    ResourceStatus.Undownload,
)

const activeName = computed(() => {
    const hash = decodeURIComponent(route.hash?.slice(1))
    const name = hash || tags.value[0]?.name || ''
    const item = tags.value?.find(item => item.name === name)
    return item?.name || name
})
const tagId = computed(() => {
    const name = activeName.value
    const item = tags.value.find(item => item.name === name)
    return item?.id || 0
})

onMounted(listTag)

async function listTag() {
    const { data } = await apis.Misskon.listMisskonTag({
        status: tagStatus.value || undefined,
        page: 0,
    })
    tags.value = data.list
}

async function listMisskon() {
    if (!tagId.value) {
        return
    }
    const { data } = await apis.Misskon.listMisskon({
        page: 0,
        status: resStatus.value || undefined,
        tagId: tagId.value,
    })
    misskons.value = data.list
}

async function onUpdate(id: number, status: ResourceStatus) {
    await apis.Misskon.updateMisskon({ id }, { status })
    const list = [...misskons.value]
    const idx = list.findIndex(item => item.id === id)
    if (idx !== -1) {
        list.splice(idx, 1)
    }
    misskons.value = list
}

function onMenuChange(name: string) {
    router.push(`#${name}`)
}

function changeTag(direction: 'prev' | 'next') {
    const node = tagMap.value[tagId.value]
    if (!node) {
        return
    }
    let nextId: number | undefined
    if (direction === 'prev') {
        nextId = node.prev
    } else {
        nextId = node.next
    }
    if (!nextId) {
        return
    }

    const nextNode = tagMap.value[nextId]
    if (!nextNode) {
        return
    }
    router.push(`#${nextNode.name}`)
}

watch(tagId, listMisskon)

let isLoading = false
// NOTE: 长按只触发一次
const {
    // New Line
    ArrowUp,
    ArrowDown,
} = useMagicKeys()
watch([() => GlobalStore.KeyShift, ArrowUp, ArrowDown], () => {
    if (isLoading || !GlobalStore.KeyShift) {
        return
    }

    try {
        isLoading = true
        if (ArrowUp?.value) {
            changeTag('prev')
        } else if (ArrowDown?.value) {
            changeTag('next')
        }
    } catch (e) {
        console.error(e)
    } finally {
        isLoading = false
    }
})
</script>
