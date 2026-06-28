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
            <ElAside class="misskon-aside">
                <ComAside :data="tags" @status="onStatus" @menu="onMenu" />
            </ElAside>
            <ElMain class="misskon-main">Main</ElMain>
        </ElContainer>
    </ElContainer>
</template>

<script setup lang="ts">
import router from '@/router/index.js'
import ComAside from './Aside.vue'
import { apis, RespMisskonTag } from '@/utils'
import { ResourceStatus } from '@shared'
import { ElAside, ElContainer } from 'element-plus'
import { onMounted, shallowRef } from 'vue'

const tags = shallowRef<RespMisskonTag[]>([])

onMounted(async () => {
    const resTag = await apis.Misskon.listMisskonTag({ page: 0 })
    tags.value = resTag.data.list
})

function onStatus(status?: ResourceStatus) {
    console.log('Status:', status)
}

function onMenu(name: string) {
    console.log('Menu:', name)
    router.push(`#${name}`)
}
</script>
