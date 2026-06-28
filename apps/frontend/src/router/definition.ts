import { RouteRecordSingleView } from 'vue-router'

export interface MetaRoute {
    path: string
    name: string
    meta?: {
        hideMain?: boolean
    }
}

export interface RouteItem extends MetaRoute {
    component?: RouteRecordSingleView['component']
    children: RouteItem[]
}
