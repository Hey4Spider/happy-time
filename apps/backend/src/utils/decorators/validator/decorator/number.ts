import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import { IsNumber, IsInt, IsNumberOptions } from 'class-validator'
import { _Overloads, _ArgHelper, _DecoratorHelper } from '../utils'

export const IsNumberData: _Overloads<IsNumberOptions> = (...args: any[]) => {
    const { config, params } = _ArgHelper<IsNumberOptions>(args)
    return applyDecorators(
        IsNumber(params.options, params.validation),
        Type(() => Number),
        ..._DecoratorHelper(config, params),
    )
}

export const IsIntData: _Overloads = (...args: any[]) => {
    const { config, params } = _ArgHelper(args)
    return applyDecorators(
        IsInt(params?.validation),
        Type(() => Number),
        ..._DecoratorHelper(config, params),
    )
}
