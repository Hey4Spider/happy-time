import { ApiProperty } from '@nestjs/swagger'

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
