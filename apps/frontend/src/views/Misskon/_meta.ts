import { MetaRoute } from '@/router'
import { MetaMenu } from '@/utils'

const _Route = '/misskon'

export const Menu: MetaMenu = {
    label: '资源下载',
    route: _Route,
    sort: 2,
}

export const Route: MetaRoute = {
    path: _Route,
    name: 'misskon',
    meta: {
        hideMain: true,
    },
}
