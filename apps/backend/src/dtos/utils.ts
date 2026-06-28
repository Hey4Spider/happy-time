import { IsEnumData, IsFile, IsIntData, IsNotEmptyString } from '@/utils'
import { MultipartFile } from '@fastify/multipart'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { OrderFunc } from '@shared'
import { Transform } from 'class-transformer'
import { IsArray } from 'class-validator'

export class UploadFileDto {
    @ApiProperty({
        type: 'array',
        items: { type: 'file' },
    })
    @IsArray()
    @IsFile({ each: true })
    @Transform(({ value }) => {
        if (Array.isArray(value)) {
            return value
        } else {
            return [value]
        }
    })
    file!: MultipartFile[]

    @IsArray()
    @IsNotEmptyString({}, { validation: { each: true } })
    filename?: string[]

    // _mimetype!: string[]
    // _length!: number
}

export class RequiredUtilDataDto {
    /** 分页参数 */
    @IsIntData({ min: 0 })
    page?: number

    @IsIntData({ min: 0 })
    pageSize?: number

    /** 排序参数 */
    @IsEnumData(OrderFunc, 'OrderFunc')
    order?: OrderFunc

    @IsNotEmptyString()
    orderBy?: string

    /** 通用字段 */
    @IsNotEmptyString({ required: true })
    name!: string

    @IsNotEmptyString({
        swagger: {
            type: 'string',
            nullable: true,
        },
    })
    description?: Nullable<string>
}

export class UtilDataDto extends PartialType(RequiredUtilDataDto) {}
