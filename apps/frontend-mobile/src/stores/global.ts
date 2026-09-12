import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('globalStore', () => {
    const Workspace = useLocalStorage(`WORKSPACE`, '')

    return {
        Workspace,
    }
})
