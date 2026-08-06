import { LoginDto } from '@/dtos'
import { RespLogin } from '@/responses'
import { ApiResult } from '@/utils'
import { Body, Controller, Post } from '@nestjs/common'

@Controller('public')
export class PublicController {
    @Post('login')
    @ApiResult({ type: RespLogin })
    async login(@Body() { password }: LoginDto) {
        return { status: password === process.env.INTERNAL_SECRET }
    }
}
