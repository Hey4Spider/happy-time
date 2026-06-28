import { PrismaClient } from '../prisma/client'

export * from '../prisma/client'

export type PrismaTransaction = Parameters<
    Parameters<PrismaClient['$transaction']>[0]
>[0]

export interface PrismaRelationItem {
    A: number | string
    B: number | string
}
