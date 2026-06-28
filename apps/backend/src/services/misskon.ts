import {
    ListMisskonQueryDto,
    ListMisskonTagQueryDto,
    UpdateMisskonDto,
    UpdateMisskonTagDto,
} from '@/dtos'
import { Database } from '@/utils'
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaRelationItem } from '@node/database'
import { DbStringFilter } from '@node/helper'
import { objListToMap, ResourceStatus } from '@shared'

interface TagKeyword {
    name: string
    like: number
}
interface TagData {
    data: TagKeyword & { [k: string]: any }
    count: number
    status: Record<ResourceStatus, number>
    keyword: TagKeyword
}

@Injectable()
export class MisskonService implements OnModuleInit {
    private readonly TagMap: Recordable<TagData> = {}

    constructor(private readonly db: Database) {}

    async listMisskonTag({
        name,
        like,
        status,
        page = 1,
        pageSize = 10,
    }: ListMisskonTagQueryDto) {
        const _name = name?.toLowerCase()

        const allList: TagData[] = []
        for (const id in this.TagMap) {
            const tag = this.TagMap[id]
            let isTar = true
            if (isTar && _name) {
                isTar = tag.keyword.name.includes(_name)
            }
            if (!isTar) {
                continue
            }

            if (isTar && like) {
                isTar = tag.keyword.like === like
            }
            if (!isTar) {
                continue
            }

            if (isTar && status) {
                isTar = tag.status[status] > 0
            }

            if (isTar) {
                allList.push(tag)
            }
        }

        const list = allList
            .sort((a, b) => {
                if (a.data.like !== b.data.like) {
                    return b.data.like - a.data.like
                } else if (a.count !== b.count) {
                    return b.count - a.count
                } else {
                    return a.data.name.localeCompare(b.data.name)
                }
            })
            .map(item => ({
                ...item.data,
                count: item.count,
            }))

        const total = list.length
        if (page !== 0 && pageSize !== 0) {
            const end = page * pageSize
            const start = end - pageSize
            return { total, list: list.slice(start, end) }
        } else {
            return { total, list }
        }
    }

    async updateMisskonTag(id: number, { like }: UpdateMisskonTagDto) {
        const item = this.TagMap[id]
        if (!item) {
            throw new NotFoundException('MisskonTag not found')
        }
        await this.db.misskonTag.update({
            where: { id },
            data: { like },
        })
        this.TagMap[id].data.like = like
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

    async onModuleInit() {
        const [misskonList, relationList, tagList] = await this.db.$transaction(
            [
                this.db.misskon.findMany(),
                this.db.$queryRaw<
                    PrismaRelationItem[]
                >`SELECT * FROM "public"."_MisskonToMisskonTag"`,
                this.db.misskonTag.findMany(),
            ],
        )
        const relationMap = objListToMap(relationList, 'A', item => item.B)
        for (const item of tagList) {
            this.TagMap[item.id] = {
                data: item,
                count: 0,
                status: initStatus(),
                keyword: {
                    name: item.name.toLowerCase(),
                    like: item.like,
                },
            }
        }
        for (const item of misskonList) {
            const tagId = relationMap[item.id]
            const TagItem = this.TagMap[tagId]
            if (!TagItem) {
                throw new Error('Misskon Data Error')
            }

            ++TagItem.count
            ++TagItem.status[item.status]
        }

        function initStatus() {
            return {
                [ResourceStatus.Undownload]: 0,
                [ResourceStatus.Downloaded]: 0,
                [ResourceStatus.CanDownload]: 0,
                [ResourceStatus.DontLike]: 0,
                [ResourceStatus.Failed]: 0,
            }
        }
    }
}
