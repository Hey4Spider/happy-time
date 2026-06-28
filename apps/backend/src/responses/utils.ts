import { ApiRespPropNullable } from '@/utils'
import { ApiProperty } from '@nestjs/swagger'

export class RespUtilData {
    @ApiProperty()
    id!: number

    @ApiProperty()
    name!: string

    @ApiRespPropNullable(String)
    description?: Nullable<string>
}
