import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useStore = defineStore('imageStore', () => {
    const Workspace = useLocalStorage(`WORKSPACE`, '')

    const Config = reactive({
        multi: 1,
        delay: 80,
        auto: false,
    })

    return {
        Workspace,
        Config,
    }
})
