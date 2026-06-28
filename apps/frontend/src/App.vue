<template>
    <ElContainer class="app-container">
        <ElAside class="app-aside-dark aside">
            <Aside />
        </ElAside>

        <ElMain v-if="!route.meta.hideMain" :class="mainClass">
            <RouterView />
        </ElMain>
        <RouterView v-else />
    </ElContainer>
</template>

<script setup lang="ts">
import { ElAside, ElContainer, ElMain } from 'element-plus'
import Aside from '@com/Aside/Index.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import { useStore } from './stores'

const { KeyMeta, KeyShift } = useStore()
const route = useRoute()
const mainClass = computed(() => {
    const classList = (route.meta.classList || []) as string[]
    return [...classList, 'app-main']
})

useEventListener('blur', () => {
    KeyMeta.value = false
    KeyShift.value = false
})
useEventListener('keydown', onMagicKey)
useEventListener('keyup', onMagicKey)
async function onMagicKey(e: KeyboardEvent) {
    if (e.key === 'Meta') {
        KeyMeta.value = e.metaKey
    } else if (e.key === 'Shift') {
        KeyShift.value = e.shiftKey
    }
}
</script>

<style scoped lang="scss">
.aside {
    width: 150px;
}
</style>
