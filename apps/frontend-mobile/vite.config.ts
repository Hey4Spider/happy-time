import * as path from 'path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
    envDir: path.join(__dirname, '../../config/web'),
    optimizeDeps: {
        include: ['@element-plus/icons-vue'],
    },
    server: {
        host: '0.0.0.0',
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@com': fileURLToPath(new URL('./src/components', import.meta.url)),
            '@shared': fileURLToPath(
                new URL('../../packages/shared/index', import.meta.url),
            ),
        },
    },
})
