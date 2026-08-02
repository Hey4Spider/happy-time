import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('globalStore', () => {
    const KeyMeta = ref(false)
    const KeyShift = ref(false)

    return {
        KeyMeta,
        KeyShift,
    }
})
