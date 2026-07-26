/// <reference types="vite/client" />

import 'axios'

declare module 'axios' {
    interface AxiosRequestConfig {
        /**
         * 请求成功时是否弹出通知。
         * - `true`：默认文案「请求成功」
         * - `string`：自定义文案
         * - 未设置 / `false`：不通知
         */
        notify?: boolean | string
    }
}
