import { applyDecorators } from '@nestjs/common'
import { IsEnum } from 'class-validator'
import { _ArgHelper, _DecoratorHelper, _OverloadsWithEnum } from '../utils'

export const IsEnumData: _OverloadsWithEnum = (
    data: object,
    name: string,
    ...args: any[]
) => {
    const { config, params } = _ArgHelper(args)
    params.swagger = {
        ...params.swagger,
        enum: data,
        enumName: name,
        'x-enumNames': Object.keys(data).filter(k => !/^\d+|[A-Z]+$/.test(k)),
    }
    return applyDecorators(IsEnum(data), ..._DecoratorHelper(config, params))
}
