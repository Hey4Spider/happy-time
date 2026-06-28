import {
    ListImageQueryDto,
    MergeImageDto,
    OperateWorkspaceDto,
    RemoveImageQueryDto,
} from '@/dtos'
import { RespResource, RespWorkspace } from '@/responses'
import { ImagesService } from '@/services'
import { ApiResult, FileBody } from '@/utils'
import {
    Controller,
    Post,
    Get,
    StreamableFile,
    Query,
    Body,
    Delete,
} from '@nestjs/common'
import { ApiBody, ApiResponse } from '@nestjs/swagger'
import { randomUUID } from 'node:crypto'

@Controller('images')
export class ImagesController {
    constructor(private readonly service: ImagesService) {}

    @Get()
    @ApiResult({ type: RespResource, isList: true })
    async listImage(@Query() query: ListImageQueryDto) {
        return await this.service.listImage(query)
    }

    @Get('workspaces')
    @ApiResult({ type: RespWorkspace, isList: true })
    listWorkspace() {
        return this.service.listWorkspace()
    }

    @Post('workspace')
    operateWorkspcae(@Body() body: OperateWorkspaceDto) {
        return this.service.operateWorkspcae(body)
    }

    @Post('merge')
    @ApiBody({ type: MergeImageDto })
    @ApiResponse({
        schema: {
            type: 'string',
            format: 'binary',
        },
    })
    async mergeImage(@FileBody() body: MergeImageDto) {
        const { type, stream } = await this.service.mergeImage(body)
        return new StreamableFile(stream, {
            type: 'application/png',
            disposition: `attachment; filename="${randomUUID()}.${type}"`,
        })
    }

    @Delete()
    @ApiResult()
    removeImage(@Query() query: RemoveImageQueryDto) {
        return this.service.removeImage(query)
    }

    @Post('revoke')
    @ApiResult()
    revokeImage() {
        return this.service.revokeImage()
    }
}
