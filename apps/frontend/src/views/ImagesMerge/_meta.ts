import { MetaRoute } from '@/router'
import { MetaMenu } from '@/utils'

const _Route = '/images-merge'

export const Menu: MetaMenu = {
    label: '资源合并',
    route: _Route,
    sort: 3,
}

export const Route: MetaRoute = {
    path: _Route,
    name: 'imagesMerge',
}
