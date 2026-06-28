export interface MetaMenu {
    label: string
    route?: string
    sort?: number
}

export interface MenuItem extends MetaMenu {
    uid: string
    children: MenuItem[]
}
