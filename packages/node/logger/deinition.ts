export const APPLICATION = Symbol('Application')
export const CATEGORY = Symbol('Category')

export interface LoggerMeta {
    [APPLICATION]?: string
    [CATEGORY]?: string
}
