import { MetaRoute } from '@/router'
import { MetaMenu } from '@/utils'

const _Route = '/images'

export const Menu: MetaMenu = {
    label: '资源预览',
    route: _Route,
    sort: 1,
}

export const Route: MetaRoute = {
    path: _Route,
    name: 'images',
    meta: {
        hideMain: true,
    },
}
