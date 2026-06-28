import { ApiRespEnum } from '@/utils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ResourceType } from '@shared'

export class RespWorkspace {
    @ApiProperty()
    key!: string

    @ApiProperty()
    path!: string

    @ApiProperty()
    trash!: string

    @ApiProperty()
    isActive!: boolean
}

export class RespResource {
    @ApiProperty()
    path!: string

    @ApiProperty()
    name!: string

    @ApiRespEnum(ResourceType, 'ResourceType')
    type!: ResourceType

    @ApiPropertyOptional()
    size?: string
}
