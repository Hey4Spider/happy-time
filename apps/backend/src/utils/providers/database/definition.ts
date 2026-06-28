import { Prisma } from '@node/database'
import { Operation } from '@prisma/client/runtime/client'

export interface _FindOptions {
    message?: string
}

export interface _ListOptions {
    page?: number
    pageSize?: number
    orderBy?: string
    order?: Prisma.SortOrder
}

export type _Args<T, A, O extends Operation> = Prisma.SelectSubset<
    A,
    Prisma.Exact<A, Prisma.Args<T, O>>
>

export const _LogOptions = {
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
    ],
} satisfies Pick<Prisma.PrismaClientOptions, 'log'>
