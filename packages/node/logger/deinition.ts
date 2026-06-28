export const APPLICATION = Symbol('Application')
export const CATEGORY = Symbol('Category')

export enum LogLevel {
    Error = 'error',
    Warn = 'warn',
    Info = 'info',
    Http = 'http',
    Verbose = 'verbose',
    Debug = 'debug',
    Silly = 'silly',
}

export interface LoggerMeta {
    [APPLICATION]?: string
    [CATEGORY]?: string
}
