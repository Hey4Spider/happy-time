import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { UtilDataDto } from './utils'
import { IsEnumData, IsIntData } from '@/utils'
import { ResourceStatus } from '@shared'

export class UpdateMisskonTagDto {
    @IsIntData({ required: true, min: 1 })
    like!: number
}

export class ListMisskonTagQueryDto extends IntersectionType(
    PartialType(PickType(UpdateMisskonTagDto, ['like'] as const)),
    PickType(UtilDataDto, ['page', 'pageSize', 'name'] as const),
) {
    @IsEnumData(ResourceStatus, 'ResourceStatus')
    status?: ResourceStatus
}

export class ListMisskonQueryDto extends PickType(ListMisskonTagQueryDto, [
    'page',
    'pageSize',
    'name',
    'status',
] as const) {
    @IsIntData({ min: 1 })
    tagId?: number
}

export class UpdateMisskonDto extends PickType(ListMisskonTagQueryDto, [
    'status',
] as const) {}
