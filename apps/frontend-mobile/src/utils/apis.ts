import { Apis } from '@apis'
import { AxiosError } from 'axios'
import { ElMessage, ElNotification } from 'element-plus'

export * from '@apis'

export const apis = new Apis({
    baseURL: import.meta.env.VITE_SERVER_URL,
    format: 'json',
})
apis.instance.interceptors.request.use(config => {
    for (const key in config.params) {
        if (config.params[key] === '') {
            delete config.params[key]
        }
    }
    return config
})
apis.instance.interceptors.response.use(
    response => {
        const notify = response.config.notify
        if (notify) {
            ElMessage.closeAll()
            ElMessage.success(typeof notify === 'string' ? notify : '请求成功')
        }
        return response
    },
    (error: AxiosError) => {
        ElNotification.error('请求失败')
        return Promise.reject(error)
    },
)
