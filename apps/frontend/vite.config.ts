import * as path from 'path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const plugins: PluginOption[] = [vue()]
if (process.env.VITE_DEV) {
    plugins.push(vueDevTools())
}

// https://vite.dev/config/
export default defineConfig({
    plugins,
    envDir: path.join(__dirname, '../../config/web'),
    optimizeDeps: {
        include: ['@element-plus/icons-vue'],
    },
    server: {
        port: 5174,
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
