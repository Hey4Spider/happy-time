import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const Dir = path.dirname(fileURLToPath(import.meta.url))

const plugins: PluginOption[] = [vue()]
if (process.env.VITE_DEV) {
    plugins.push(vueDevTools())
}

// https://vite.dev/config/
export default defineConfig({
    plugins,
    envDir: path.join(Dir, '../../config/web'),
    optimizeDeps: {
        include: ['@element-plus/icons-vue'],
    },
    server: {
        port: 5174,
    },
    resolve: {
        tsconfigPaths: true,
    },
})
