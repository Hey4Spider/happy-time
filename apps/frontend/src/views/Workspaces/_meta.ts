import { MetaRoute } from '@/router'
import { MetaMenu } from '@/utils'

const _Route = '/workspaces'

export const Menu: MetaMenu = {
    label: '工作区',
    route: _Route,
    sort: 1,
}

export const Route: MetaRoute = {
    path: _Route,
    name: 'workspaces',
}
