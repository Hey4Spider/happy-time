import { randomString } from '@shared'
import { MenuItem } from './definition'

const ModuleMap: Recordable<{
    Menu: MenuItem
}> = import.meta.glob('../../views/**/_meta.ts', { eager: true })
const ModuleEntryList = Object.entries(ModuleMap).sort(([pa, ma], [pb, mb]) => {
    const la = pa.split('/').length
    const sa = ma.Menu.sort || Infinity

    const lb = pb.split('/').length
    const sb = mb.Menu.sort || Infinity

    if (la !== lb) {
        return la - lb
    } else if (sa !== sb) {
        return sa - sb
    } else {
        return pa > pb ? 1 : -1
    }
})

const Root: MenuItem = {
    label: '/',
    uid: randomString(),
    children: [],
}
const DataMap: Recordable<MenuItem> = {}
for (const [path, { Menu }] of ModuleEntryList) {
    const pathList = path.split('/').slice(3)
    const node: MenuItem = {
        ...Menu,
        uid: randomString(),
        children: [],
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

export * from './definition'
export const MenuData: MenuItem[] = Root.children
