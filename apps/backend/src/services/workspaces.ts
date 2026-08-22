import {
    BadRequestException,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common'
import * as fs from 'node:fs'
import { Database, NestLogger, Workspace } from '@/utils'
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '@/dtos'

@Injectable()
export class WorkspacesService implements OnModuleInit {
    private readonly WorkspaceMap: Recordable<Workspace> = {}

    constructor(
        private readonly logger: NestLogger,
        private readonly db: Database,
    ) {
        this.logger.setCategory(WorkspacesService.name)
    }

    async onModuleInit() {
        const list = await this.db.workspace.findMany()
        for (const item of list) {
            this.WorkspaceMap[item.key] = item
        }
    }

    listWorkspace() {
        const list = Object.values(this.WorkspaceMap).sort((a, b) =>
            a.key > b.key ? 1 : -1,
        )
        return {
            total: list.length,
            list: list.map(item => {
                let isActive = false
                try {
                    fs.statSync(item.path)
                    isActive = true
                    try {
                        fs.statSync(item.trash)
                    } catch (e) {
                        fs.mkdirSync(item.trash, { recursive: true })
                    }
                } catch (e) {
                    this.logger.warn(`'${item.path}' is not active`)
                }
                return { ...item, isActive }
            }),
        }
    }

    getWorkspace(
        key: string,
        { checkActive = true }: { checkActive?: boolean } = {},
    ) {
        const data = this.WorkspaceMap[key]
        if (!data) {
            throw new NotFoundException(`Workspace '${key}' not found`)
        }
        if (!checkActive) {
            return data
        }

        try {
            fs.statSync(data.path)
            data.isActive = true
        } catch (e) {
            data.isActive = false
        }
        return data
    }

    async createWorkspace(body: CreateWorkspaceDto) {
        if (this.WorkspaceMap[body.key]) {
            throw new BadRequestException(
                `Workspace '${body.key}' already exist`,
            )
        }
        const data = await this.db.workspace.create({
            data: body,
        })
        this.WorkspaceMap[body.key] = data
        return data
    }

    async updateWorkspace(key: string, body: UpdateWorkspaceDto) {
        this.getWorkspace(key, {
            checkActive: false,
        })
        const data = await this.db.workspace.update({
            where: { key },
            data: body,
        })
        this.WorkspaceMap[key] = data
        return data
    }

    async removeWorkspace(key: string) {
        this.getWorkspace(key, {
            checkActive: false,
        })

        await this.db.workspace.delete({
            where: { key },
        })
        delete this.WorkspaceMap[key]
    }
}
