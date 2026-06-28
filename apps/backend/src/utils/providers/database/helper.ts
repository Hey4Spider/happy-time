import { Prisma } from '@node/database'

export function PrismaStringFilter(
    value?: string,
    mode: Prisma.QueryMode = 'insensitive',
): Prisma.StringFilter | undefined {
    if (value) {
        return {
            contains: value,
            mode,
        }
    }
}
