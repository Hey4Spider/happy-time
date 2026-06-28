import { Prisma } from '../prisma/client'
import { isString } from 'class-validator'

export function DbStringFilter(value?: string) {
    if (isString(value) && value) {
        return {
            equals: value,
            mode: 'insensitive',
        } satisfies Prisma.StringFilter
    } else {
        return undefined
    }
}
