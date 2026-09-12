import { ApiConfig, HttpClient } from './http-client'
import { Images } from './Images'
import { Misskon } from './Misskon'
import { Public } from './Public'
import { Workspaces } from './Workspaces'

export * from './data-contracts'
export * from './http-client'

export class Apis<
    SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
    readonly Images: Images<SecurityDataType>
    readonly Misskon: Misskon<SecurityDataType>
    readonly Public: Public<SecurityDataType>
    readonly Workspaces: Workspaces<SecurityDataType>

    constructor(options: ApiConfig<SecurityDataType> = {}) {
        super(options)
        this.Images = new Images(this)
        this.Misskon = new Misskon(this)
        this.Public = new Public(this)
        this.Workspaces = new Workspaces(this)
    }
}
