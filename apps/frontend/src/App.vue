<template>
    <ElContainer class="app-container">
        <ElAside class="app-aside-dark" style="width: 150px">
            <AsideMenu dark />
        </ElAside>

        <RouterView v-if="route.meta.hideMain" />
        <ElMain v-else :class="mainClass">
            <RouterView />
        </ElMain>
    </ElContainer>
</template>

<script setup lang="ts">
import AsideMenu from '@com/AsideMenu.vue'
import { ElAside, ElContainer, ElMain } from 'element-plus'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import { useGlobalStore } from './stores'

const route = useRoute()
const Store = useGlobalStore()

const mainClass = computed(() => {
    const classList = (route.meta.classList || []) as string[]
    return [...classList, 'app-main']
})

useEventListener('blur', () => {
    Store.KeyMeta = false
    Store.KeyShift = false
})
useEventListener('keydown', onMagicKey)
useEventListener('keyup', onMagicKey)
async function onMagicKey(e: KeyboardEvent) {
    if (e.key === 'Meta') {
        Store.KeyMeta = e.metaKey
    } else if (e.key === 'Shift') {
        Store.KeyShift = e.shiftKey
    }
}
</script>
