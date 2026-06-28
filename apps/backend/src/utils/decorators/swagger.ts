import { applyDecorators, Type } from '@nestjs/common'
import {
    ApiExtraModels,
    ApiProperty,
    ApiPropertyOptional,
    ApiPropertyOptions,
    ApiResponse,
    ApiResponseSchemaHost,
    getSchemaPath,
} from '@nestjs/swagger'

export function ApiRespEnum<D extends object = object>(
    data: D,
    name: string,
    { required = true }: { required?: boolean } = {},
) {
    const opts: ApiPropertyOptions = {
        enum: data,
        enumName: name,
        'x-enumNames': Object.keys(data).filter(k => !/^\d+|[A-Z]+$/.test(k)),
    }
    if (required) {
        return applyDecorators(ApiProperty(opts))
    } else {
        return applyDecorators(ApiPropertyOptional(opts))
    }
}

type _RespPropOptions = ApiPropertyOptions & {
    required?: boolean
}
export function ApiRespPropNullable<T extends Type<unknown>>(
    type: T,
    { required = true, ...options }: _RespPropOptions = {},
) {
    const decorators: PropertyDecorator[] = []
    if (required) {
        decorators.push(ApiProperty({ ...options, type, nullable: true }))
    } else {
        decorators.push(
            ApiPropertyOptional({ ...options, type, nullable: true }),
        )
    }
    return applyDecorators(...decorators)
}

type _ResultOptions<T> = {
    type?: T
    isList?: boolean
}
export function ApiResult<T extends Type<unknown>>({
    type,
    isList,
}: _ResultOptions<T> = {}) {
    if (!type) {
        return applyDecorators(ApiResponse({}))
    }

    const schema: ApiResponseSchemaHost['schema'] = {}
    if (isList) {
        schema.required = ['total', 'list']
        schema.properties = {
            total: { type: 'number' },
            list: {
                items: { $ref: getSchemaPath(type) },
            },
        }
    } else {
        schema.$ref = getSchemaPath(type)
    }
    return applyDecorators(ApiExtraModels(type), ApiResponse({ schema }))
}
