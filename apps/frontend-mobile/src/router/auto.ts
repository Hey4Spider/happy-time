import { RouteItem } from './definition'

const ModuleMap: Recordable<{ Route: RouteItem }> = import.meta.glob(
    `../views/**/_meta.ts`,
    { eager: true },
)
const ModuleEntryList = Object.entries(ModuleMap)

const Root: RouteItem = {
    path: '',
    name: '',
    children: [],
}
const DataMap: Recordable<RouteItem> = {}
for (const [path, { Route }] of ModuleEntryList) {
    const pathList = path.split('/').slice(3)
    const node: RouteItem = { ...Route, children: [] }
    if (Route?.path) {
        const comList = path.split('/').slice(0, -1)
        comList.push('Index.vue')
        node.component = () => import(/* @vite-ignore */ comList.join('/'))
    } else {
        continue
    }

    let currNode = Root
    for (const currPath of pathList) {
        if (currPath === '_meta.ts') {
            currNode.children!.push(node)
        } else if (DataMap[currPath]) {
            currNode = DataMap[currPath]
        } else {
            DataMap[currPath] = node
        }
    }
}

export const RouterConfig = Root.children
