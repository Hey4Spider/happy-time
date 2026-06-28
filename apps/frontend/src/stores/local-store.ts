import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'

export function useStore() {
    const Workspace = useLocalStorage(`WORKSPACE`, '')
    const KeyMeta = ref(false)
    const KeyShift = ref(false)

    return {
        Workspace,
        KeyMeta,
        KeyShift,
    }
}
