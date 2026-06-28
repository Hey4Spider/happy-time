import { Injectable, NotFoundException } from '@nestjs/common'
import * as fs from 'node:fs'
import { NestLogger, Workspace, WorkspaceList } from '@/utils'
import { objListToMap } from '@shared'

@Injectable()
export class WorkspacesService {
    private readonly WorkspaceMap!: Recordable<Workspace>

    constructor(private readonly logger: NestLogger) {
        this.logger.setCategory(WorkspacesService.name)
        this.WorkspaceMap = objListToMap(WorkspaceList, 'key')
    }

    listWorkspace() {
        return {
            total: WorkspaceList.length,
            list: WorkspaceList.map(item => {
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

    get(key: string) {
        const data = this._get(key)
        try {
            fs.statSync(data.path)
            data.isActive = true
        } catch (e) {
            data.isActive = false
        }
        return data
    }

    private _get(key: string) {
        const workspace = this.WorkspaceMap[key]
        if (!workspace) {
            throw new NotFoundException(`Workspace '${key}' not found`)
        }
        return workspace
    }
}
