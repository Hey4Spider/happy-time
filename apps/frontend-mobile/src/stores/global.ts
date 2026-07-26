import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('globalStore', () => {
    const Workspace = useLocalStorage(`WORKSPACE`, '')
    const KeyMeta = ref(false)
    const KeyShift = ref(false)

    return {
        Workspace,
        KeyMeta,
        KeyShift,
    }
})
