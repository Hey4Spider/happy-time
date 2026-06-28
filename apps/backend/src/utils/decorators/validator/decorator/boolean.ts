import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'
import {
    isArray,
    isBoolean,
    IsBoolean,
    isNotEmptyObject,
    isNumber,
    isObject,
    isString,
} from 'class-validator'
import { _ArgHelper, _DecoratorHelper, _Overloads } from '../utils'

export const IsBooleanData: _Overloads = (...args: any[]) => {
    const { config, params } = _ArgHelper(args)
    return applyDecorators(
        IsBoolean(params?.validation),
        Transform(({ value }) => {
            if (isBoolean(value)) return value
            if (isString(value)) return !['false', '0', ''].includes(value)
            if (isNumber(value)) return value !== 0
            if (isArray(value)) return value.length > 0
            if (isObject(value)) return isNotEmptyObject(value)
            return false
        }),
        ..._DecoratorHelper(config, params),
    )
}
