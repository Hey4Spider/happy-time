import { createRouter, createWebHashHistory } from 'vue-router'
import { RouterConfig } from './auto'

export * from './definition'
export default createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            redirect:
                import.meta.env.VITE_DEFAULT_HOME || RouterConfig[0]!.path,
        },
        ...RouterConfig,
    ],
})
