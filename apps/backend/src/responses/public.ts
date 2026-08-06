import { ApiProperty } from '@nestjs/swagger'

export class RespLogin {
    @ApiProperty()
    status!: boolean
}
