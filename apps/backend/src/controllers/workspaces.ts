import { CreateWorkspaceDto, UpdateWorkspaceDto } from '@/dtos'
import { RespWorkspace } from '@/responses'
import { WorkspacesService } from '@/services'
import { ApiResult } from '@/utils'
import { Controller, Post, Get, Body, Delete, Put, Param } from '@nestjs/common'

@Controller('workspaces')
export class WorkspacesController {
    constructor(private readonly service: WorkspacesService) {}

    @Get()
    @ApiResult({ type: RespWorkspace, isList: true })
    listWorkspace() {
        return this.service.listWorkspace()
    }

    @Get(':key')
    @ApiResult({ type: RespWorkspace })
    getWorkspace(@Param('key') key: string) {
        return this.service.getWorkspace(key)
    }

    @Post()
    @ApiResult({ type: RespWorkspace })
    async createWorkspcae(@Body() body: CreateWorkspaceDto) {
        return await this.service.createWorkspace(body)
    }

    @Put(':key')
    @ApiResult({ type: RespWorkspace })
    async updateWorkspace(
        @Param('key') key: string,
        @Body() body: UpdateWorkspaceDto,
    ) {
        return await this.service.updateWorkspace(key, body)
    }

    @Delete(':key')
    @ApiResult()
    async removeWorkspace(@Param('key') key: string) {
        await this.service.removeWorkspace(key)
    }
}
