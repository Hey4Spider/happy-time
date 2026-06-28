import { ApiRespEnum } from '@/utils'
import { ApiProperty } from '@nestjs/swagger'
import { ResourceStatus } from '@shared'

export class RespMisskonTag {
    @ApiProperty()
    id!: number

    @ApiProperty()
    name!: string

    @ApiProperty()
    url!: string

    @ApiProperty()
    like!: number

    @ApiProperty()
    count!: number
}

export class RespMisskon {
    @ApiProperty()
    id!: number

    @ApiProperty()
    key!: string

    @ApiProperty()
    name!: string

    @ApiProperty()
    url!: string

    @ApiProperty()
    link!: string

    @ApiRespEnum(ResourceStatus, 'ResourceStatus')
    status!: ResourceStatus
}
