import { ElMessage, ElNotification } from 'element-plus'
import { ApiConfig, HttpClient } from './http-client'
import { AxiosError } from 'axios'
import { Images } from './Images'
import { Misskon } from './Misskon'
import { Public } from './Public'

export * from './data-contracts'

export class Apis<
    SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
    private readonly IgnorePath = [
        './index.ts',
        './data-contracts.ts',
        './http-client.ts',
    ]

    readonly Public!: Public
    readonly Images!: Images
    readonly Misskon!: Misskon

    constructor(options: ApiConfig<SecurityDataType> = {}) {
        super(options)
        this._initApis()
    }

    private _initApis() {
        const ModuleList: Recordable = import.meta.glob('./*.ts', {
            eager: true,
        })
        for (const filePath in ModuleList) {
            if (this.IgnorePath.includes(filePath)) {
                continue
            }
            const Module = ModuleList[filePath]
            const ClassName = Object.keys(Module)[0] as string
            this[ClassName] = new Module[ClassName](this)
        }
    }
}

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
