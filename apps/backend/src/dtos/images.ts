import { IsEnumData, IsIntData, IsNotEmptyString } from '@/utils'
import { DirectionCategory, ImageType, WorkspaceOperation } from '@shared'
import { UploadFileDto } from './utils'
import { Transform } from 'class-transformer'
import { PickType } from '@nestjs/swagger'

export class ListImageQueryDto {
    @IsNotEmptyString({ required: true })
    workspace!: string

    @IsNotEmptyString()
    folder?: string
}

export class MergeImageDto extends UploadFileDto {
    @IsEnumData(DirectionCategory, 'DirectionCategory', {
        swagger: { default: DirectionCategory.Horizontal },
    })
    direction?: DirectionCategory

    @IsIntData({ min: 1 }, { swagger: { default: 1 } })
    @Transform(({ obj, value }) => {
        if (obj.direction === DirectionCategory.Column) {
            return value
        } else {
            return 1
        }
    })
    columns?: number

    @IsEnumData(ImageType, 'ImageType', { swagger: { default: ImageType.png } })
    outputType?: ImageType
}

export class OperateWorkspaceDto extends ListImageQueryDto {
    @IsEnumData(WorkspaceOperation, 'WorkspaceOperation')
    operation!: WorkspaceOperation
}

export class RemoveImageQueryDto extends PickType(ListImageQueryDto, [
    'workspace',
] as const) {
    @IsNotEmptyString({ required: true })
    image!: string

    @IsIntData({ min: 1 }, { swagger: { default: 1 } })
    count?: number
}
