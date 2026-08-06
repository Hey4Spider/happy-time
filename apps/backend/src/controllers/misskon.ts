import {
    ListMisskonQueryDto,
    ListMisskonTagQueryDto,
    UpdateMisskonDto,
    UpdateMisskonTagDto,
} from '@/dtos'
import { RespMisskonTag } from '@/responses'
import { MisskonService } from '@/services'
import { ApiResult } from '@/utils'
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'

@Controller('misskon')
export class MisskonController {
    constructor(private readonly service: MisskonService) {}

    @Get('tags')
    @ApiResult({ type: RespMisskonTag, isList: true })
    async listMisskonTag(@Query() query: ListMisskonTagQueryDto) {
        return await this.service.listMisskonTag(query)
    }

    @Put('tags/:id')
    @ApiResult()
    async updateMisskonTag(
        @Param('id') id: number,
        @Body() body: UpdateMisskonTagDto,
    ) {
        await this.service.updateMisskonTag(id, body)
    }

    @Get()
    @ApiResult({ type: RespMisskonTag, isList: true })
    async listMisskon(@Query() query: ListMisskonQueryDto) {
        return await this.service.listMisskon(query)
    }

    @Put(':id')
    @ApiResult()
    async updateMisskon(
        @Param('id') id: number,
        @Body() body: UpdateMisskonDto,
    ) {
        return await this.service.updateMisskon(id, body)
    }
}
