<template>
    <ElContainer class="app-container">
        <!-- <ElHeader class="images-header">
            <ElSelect
                class="images-workspace"
                v-model="workspace"
                @change="onWorkspace"
            >
                <ElOption
                    v-for="item of workspaces"
                    :key="item.key"
                    :value="item.key"
                    :disabled="!item.isActive"
                >
                    {{ item.key }}
                </ElOption>
            </ElSelect>
        </ElHeader> -->
        <ElContainer class="misskon-main-wrap">
            <ElAside class="app-aside">
                <ComAside
                    v-model:status="status"
                    :data="tags"
                    @status="onStatus"
                    @menu="onMenu"
                />
            </ElAside>
            <ElMain class="misskon-main">
                <ComMain :data="misskons" @update="onUpdate" />
            </ElMain>
        </ElContainer>
    </ElContainer>
</template>

<script setup lang="ts">
import ComAside from './Aside.vue'
import ComMain from './Main.vue'
import router from '@/router/index.js'
import { apis, RespMisskon, RespMisskonTag } from '@/utils'
import { ResourceStatus } from '@shared'
import { ElAside, ElContainer, ElMain } from 'element-plus'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tags = shallowRef<RespMisskonTag[]>([])
const status = ref<ResourceStatus>()

const misskons = shallowRef<RespMisskon[]>([])
const tagId = computed(() => {
    const hash = route.hash?.slice(1)
    let tag: RespMisskonTag | undefined = undefined
    if (hash) {
        const name = decodeURIComponent(hash)
        tag = tags.value.find(item => item.name === name)
    }
    if (!tag) {
        tag = tags.value[0]!
    }
    return tag?.id || 0
})

onMounted(async () => {
    await router.isReady()

    const _status = localStorage.getItem('MISSKON_STATUS')
    const nStatus = Number(_status)
    if (nStatus) {
        status.value = nStatus
    }
    await listTag()
    await listMisskon()
})

async function listTag() {
    const { data } = await apis.Misskon.listMisskonTag({
        status: status.value,
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
        status: ResourceStatus.Undownload,
        tagId: tagId.value,
    })
    misskons.value = data.list
}

async function onStatus(status?: ResourceStatus) {
    if (!status) {
        localStorage.removeItem('MISSKON_STATUS')
    } else {
        localStorage.setItem('MISSKON_STATUS', String(status))
    }
    await listTag()
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

function onMenu(name: string) {
    router.push(`#${name}`)
}

watch(tagId, listMisskon)
</script>
