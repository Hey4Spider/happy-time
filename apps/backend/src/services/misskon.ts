import {
    ListMisskonQueryDto,
    ListMisskonTagQueryDto,
    UpdateMisskonDto,
    UpdateMisskonTagDto,
} from '@/dtos'
import { Database } from '@/utils'
import { Injectable } from '@nestjs/common'
import { DbStringFilter, Prisma } from '@node/database'

@Injectable()
export class MisskonService {
    private readonly TagNameExclude = ['JP', 'AI Enhanced']
    private readonly ResourceNameExclude = ['[JP]', '[AI Enhanced]']

    constructor(private readonly db: Database) {}

    async listMisskonTag({
        name,
        like,
        status,
        page = 1,
        pageSize = 10,
    }: ListMisskonTagQueryDto) {
        const list = await this.db.misskonTag.findMany({
            where: {
                NOT: {
                    OR: this.TagNameExclude.map(name => ({
                        name: {
                            contains: name,
                            mode: 'insensitive',
                        },
                    })),
                },
                name: DbStringFilter(name),
                like: like,
            },
            select: {
                id: true,
                name: true,
                like: true,
                url: true,
                _count: {
                    select: {
                        resources: {
                            where: {
                                NOT: {
                                    OR: this.ResourceNameExclude.map(name => ({
                                        name: {
                                            contains: name,
                                            mode: 'insensitive' as const,
                                        },
                                    })),
                                },
                                status,
                            },
                        },
                    },
                },
            },
        })

        const _list: Array<
            Omit<ArrayType<typeof list>, '_count'> & { count: number }
        > = []
        for (const { _count, ...item } of list) {
            if (_count.resources > 0) {
                _list.push({
                    ...item,
                    count: _count.resources,
                })
            }
        }
        _list.sort((a, b) => {
            if (a.like !== b.like) {
                return b.like - a.like
            } else if (a.count !== b.count) {
                return b.count - a.count
            } else {
                return a.name.localeCompare(b.name)
            }
        })

        const total = _list.length
        if (page !== 0 && pageSize !== 0) {
            const end = page * pageSize
            const start = end - pageSize
            return { total, list: _list.slice(start, end) }
        } else {
            return { total, list: _list }
        }
    }

    async updateMisskonTag(id: number, { like }: UpdateMisskonTagDto) {
        const data = await this.db.ExtendDb.misskonTag.find({
            where: { id },
            select: { like: true },
        })
        if (data.like === like) {
            return
        }
        await this.db.misskonTag.update({
            where: { id },
            data: { like },
        })
    }

    async listMisskon({
        tagId,
        name,
        status,
        page = 1,
        pageSize = 10,
    }: ListMisskonQueryDto) {
        const WhereTag: Prisma.MisskonWhereInput['tags'] = {}
        if (tagId) {
            WhereTag.some = { id: tagId }
        }
        return await this.db.ExtendDb.misskon.list(
            {
                where: {
                    NOT: {
                        OR: this.ResourceNameExclude.map(name => ({
                            name: {
                                contains: name,
                                mode: 'insensitive' as const,
                            },
                        })),
                    },
                    name: DbStringFilter(name),
                    status: status,
                    tags: WhereTag,
                },
                orderBy: [
                    { status: 'asc' },
                    { updatedAt: 'desc' },
                    { id: 'desc' },
                ],
            },
            { page, pageSize },
        )
    }

    async updateMisskon(id: number, { status }: UpdateMisskonDto) {
        const item = await this.db.ExtendDb.misskon.find({
            where: { id },
            select: { status: true },
        })
        if (item.status === status) {
            return
        }
        await this.db.misskon.update({
            where: { id },
            data: { status },
        })
    }
}
