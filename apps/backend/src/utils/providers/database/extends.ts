import { Prisma } from '@node/database'
import type { Database } from '.'
import { _Args, _FindOptions, _ListOptions } from './definition'
import { NotFoundException } from '@nestjs/common'
import { Operation } from '@prisma/client/runtime/client'

type _FindOp = PickUnion<Operation, 'findUniqueOrThrow'>
type _ListOp = PickUnion<Operation, 'findMany'>

export function _initExtends(db: Database) {
    return db.$extends({
        model: {
            $allModels: {
                async find<T, const A extends Prisma.Args<T, _FindOp>>(
                    this: T,
                    args: _Args<T, A, _FindOp>,
                    { message }: _FindOptions = {},
                ): Promise<Prisma.Result<T, A, _FindOp>> {
                    const context = Prisma.getExtensionContext<T>(this)
                    const data = await (context as any).findUnique(args)
                    if (!data) {
                        throw new NotFoundException(
                            message || `${context.$name} not found`,
                        )
                    }
                    return data
                },
                async list<T, const A extends Prisma.Args<T, _ListOp>>(
                    this: T,
                    args: _Args<T, A, _ListOp>,
                    {
                        page = 0,
                        pageSize = 0,
                        orderBy = 'id',
                        order = 'desc',
                    }: _ListOptions = {},
                ): Promise<{
                    total: number
                    list: Prisma.Result<T, A, _ListOp>
                }> {
                    const context = Prisma.getExtensionContext(this)
                    const total = await (context as any).count({
                        where: (args as any).where,
                    })
                    if (total === 0) {
                        return {
                            total: 0,
                            list: [] as any,
                        }
                    }
                    const paginzation: {
                        take?: number
                        skip?: number
                    } = {}
                    if (page && pageSize) {
                        paginzation.take = pageSize
                        paginzation.skip = (page - 1) * pageSize
                    }
                    const list = await (context as any).findMany({
                        orderBy: { [orderBy]: order },
                        ...paginzation,
                        ...(args as any),
                    })
                    return { total, list }
                },
            },
        },
        // result: {
        //     // bills: {
        //     //     // amount: {
        //     //     //   needs: { amount: true },
        //     //     //   compute({ amount }) {
        //     //     //     return amount.valueOf()
        //     //     //   },
        //     //     // },
        //     //     // amountFmt: {
        //     //     //   needs: { amount: true },
        //     //     //   compute({ amount }) {
        //     //     //     const parts = amount.toFixed(2).split('.')
        //     //     //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        //     //     //     return parts.join('.')
        //     //     //   },
        //     //     // },
        //     // },
        // },
    })
}
