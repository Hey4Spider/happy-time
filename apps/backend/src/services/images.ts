import * as fs from 'node:fs'
import { NestLogger, Workspace } from '@/utils'
import {
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import {
    DirectionCategory,
    ImageType,
    prettySize,
    ResourceType,
    WorkspaceOperation,
} from '@shared'
import sharp, { OverlayOptions } from 'sharp'
import { WorkspacesService } from './workspaces'
import {
    ListImageQueryDto,
    MergeImageDto,
    OperateWorkspaceDto,
    RemoveImageQueryDto,
} from '@/dtos'
import { RespResource } from '@/responses'
import { spawnSync } from 'node:child_process'

type ImageFunc = PickKey<sharp.Sharp, 'jpeg' | 'png' | 'gif' | 'webp'>

@Injectable()
export class ImagesService {
    private readonly History: Array<{
        resPath: string
        trashPath: string
        batch?: boolean
    }> = []

    constructor(
        private readonly logger: NestLogger,
        private readonly workspace: WorkspacesService,
    ) {
        this.logger.setCategory(ImagesService.name)
    }

    async listImage({ workspace, folder }: ListImageQueryDto) {
        const _workspace = this.workspace.get(workspace)

        let resFolderPath = _workspace.path
        if (folder) {
            this._checkResource(resFolderPath, folder)
            resFolderPath += `/${folder}`
        }
        this.logger.info(`List resource: ${resFolderPath}`)

        const list: RespResource[] = []
        const resList = fs.readdirSync(resFolderPath)
        for (const item of resList) {
            if (item[0] === '.') {
                continue
            }
            const resPath = `${resFolderPath}/${item}`
            try {
                fs.accessSync(resPath, fs.constants.R_OK)
            } catch (_) {
                continue
            }

            const stat = fs.statSync(resPath)
            const data: RespResource = {
                path: folder ? `${folder}/${item}` : item,
                name: item,
                type: stat.isFile() ? ResourceType.File : ResourceType.Folder,
            }
            if (data.type === ResourceType.File) {
                data.size = prettySize(stat.size)
            }

            list.push(data)
        }
        return {
            total: list.length,
            list: list,
        }
    }

    private _checkResource(folder: string, resource: string) {
        try {
            return fs.statSync(`${folder}/${resource}`)
        } catch (e: any) {
            this.logger.error(e.stack)
            throw new NotFoundException(`Invalid resource: ${resource}`)
        }
    }

    listWorkspace() {
        return this.workspace.listWorkspace()
    }

    async operateWorkspcae({
        operation,
        workspace,
        folder,
    }: OperateWorkspaceDto) {
        const _ws = this.workspace.get(workspace)
        if (!_ws.isActive) {
            throw new ForbiddenException(
                `Workspace '${_ws.key}' is not activated`,
            )
        }

        let cmd: 'open' | 'rm' = 'open'
        const args: string[] = [_ws.path]
        if (operation === WorkspaceOperation.Open && folder) {
            args[0] = args[0] + '/' + folder
        } else if (operation === WorkspaceOperation.Trash) {
            args[0] = _ws.trash
        } else if (operation === WorkspaceOperation.Clear) {
            cmd = 'rm'
            args[0] = '-rf'
            args[1] = _ws.trash
        }

        const { status, stderr } = spawnSync(cmd, args)
        if (status) {
            this.logger.error(stderr.toString())
            throw new HttpException(
                `Invalid path: ${folder}`,
                HttpStatus.NOT_FOUND,
            )
        }

        if (operation === WorkspaceOperation.Clear) {
            fs.mkdirSync(_ws.trash)
            this.History.length = 0
        }
    }
    // MARK: 合并图片
    async mergeImage({
        file,
        // filename,
        outputType,
        direction = DirectionCategory.Horizontal,
        columns = 1,
    }: MergeImageDto) {
        const len = file.length
        if (columns > len) {
            columns = len
        }

        let mimetype: string = ''
        const imgList = await Promise.all(
            file.map(async item => {
                if (!mimetype || mimetype === item.mimetype) {
                    mimetype = item.mimetype
                }
                return sharp(await item.toBuffer())
            }),
        )
        let imgFunc: ImageFunc = 'png'
        const _outputType = mimetype.split('/')[1]
        if (outputType && ImageType[_outputType]) {
            imgFunc = _outputType as ImageFunc
        }

        const minSize = await this._mergeMinSize(imgList)
        let width = minSize.width
        let height = minSize.height
        const composite: OverlayOptions[] = []
        if (direction === DirectionCategory.Horizontal) {
            width = minSize.width * file.length
            let left = 0
            for (const item of imgList) {
                const image = item.resize({ height: minSize.height })
                const [meta, input] = await Promise.all([
                    image.metadata(),
                    image.toBuffer(),
                ])
                composite.push({
                    input,
                    left,
                    top: 0,
                })
                left += meta.width
            }
        } else if (direction === DirectionCategory.Vertical) {
            height = minSize.height * file.length
            let top = 0
            for (const item of imgList) {
                const image = item.resize({ width: minSize.width })
                const [meta, input] = await Promise.all([
                    image.metadata(),
                    image.toBuffer(),
                ])
                composite.push({
                    input,
                    left: 0,
                    top,
                })
                top += meta.height
            }
        } else if (direction === DirectionCategory.Column) {
            width = minSize.width * columns
            height = minSize.height * Math.ceil(file.length / columns)
            let top = 0
            for (let i = 0; i < len; i += columns) {
                const _len = Math.min(len, i + columns)
                let left = 0
                for (let j = i; j < _len; ++j) {
                    const input = await imgList[j]
                        .resize({
                            width: minSize.width,
                            height: minSize.height,
                        })
                        .toBuffer()
                    composite.push({
                        input,
                        left,
                        top,
                    })
                    left += minSize.width
                }
                top += minSize.height
            }
        }
        const stream = sharp({
            create: {
                width,
                height,
                channels: 4,
                background: {
                    r: 255,
                    g: 255,
                    b: 255,
                    alpha: 1,
                },
            },
        }).composite(composite)

        return {
            type: imgFunc,
            stream: stream[imgFunc](),
        }
    }
    private async _mergeMinSize(list: sharp.Sharp[]) {
        let width = Infinity
        let height = Infinity
        for (const item of list) {
            const meta = await item.metadata()
            if (meta.width < width) {
                width = meta.width
            }
            if (meta.height < height) {
                height = meta.height
            }
        }
        return { width, height }
    }
    // MARK: 删除图片或目录
    async removeImage({ workspace, image, count = 1 }: RemoveImageQueryDto) {
        const _ws = this.workspace.get(workspace)
        const stat = this._checkResource(_ws.path, image)
        if (!stat.isFile() || count === 1) {
            const name = image.split('/').at(-1)
            const history = {
                resPath: `${_ws.path}/${image}`,
                trashPath: `${_ws.trash}/${Date.now()}-${name}`,
            }
            fs.renameSync(history.resPath, history.trashPath)
            this.History.push(history)
        } else {
            await this._batchRemoveImage(_ws, image, count)
        }
    }
    private async _batchRemoveImage(
        { path, trash }: Workspace,
        image: string,
        count: number,
    ) {
        const partList = image.split('/')
        const imageName = partList.pop()
        const resFolderPath = `${path}/${partList.join('/')}`
        const imageFolder = partList.pop()

        /** 图片列表 */
        const imageList = fs.readdirSync(resFolderPath).filter(item => {
            if (item[0] === '.') {
                return false
            }
            const fullPath = `${resFolderPath}/${item}`
            const stat = fs.statSync(fullPath)
            return stat.isFile()
        })
        const idx = imageList.findIndex(item => item === imageName)
        if (idx === -1) {
            return
        }

        /** 创建临时目录 */
        const trashFolderName = `${Date.now()}-${imageFolder}`
        const tmpFolderPath = `${resFolderPath}/._${trashFolderName}`
        this.logger.debug('Create Temp Dir:', tmpFolderPath)
        fs.mkdirSync(tmpFolderPath, { recursive: true })

        /** 移动到临时目录 */
        const start = Math.max(0, idx - count + 1)
        const end = idx + 1
        const tarImageList = imageList.slice(start, end)
        for (const item of tarImageList) {
            this.logger.debug('Rename File From:', `${resFolderPath}/${item}`)
            this.logger.debug('Rename File To:', `${tmpFolderPath}/${item}`)
            fs.renameSync(
                `${resFolderPath}/${item}`,
                `${tmpFolderPath}/${item}`,
            )
        }

        /** 移动到垃圾桶 */
        const history = {
            resPath: resFolderPath,
            trashPath: `${trash}/${trashFolderName}`,
            batch: true,
        }
        this.logger.debug('Rename Dir From:', tmpFolderPath)
        this.logger.debug('Rename Dir To:', history.trashPath)
        fs.renameSync(tmpFolderPath, history.trashPath)
        this.History.push(history)
    }
    // MARK: 恢复图片或目录
    async revokeImage() {
        const history = this.History.at(-1)
        if (!history) {
            return
        }

        const { resPath, trashPath, batch } = history
        if (!batch) {
            fs.renameSync(trashPath, resPath)
        } else {
            const imageList = fs.readdirSync(trashPath)
            for (const item of imageList) {
                if (item[0] === '.') {
                    continue
                }
                fs.renameSync(`${trashPath}/${item}`, `${resPath}/${item}`)
            }
            spawnSync('rm', ['-rf', trashPath])
        }
        this.History.pop()
    }
}
