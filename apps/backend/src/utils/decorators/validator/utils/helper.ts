import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'
import { Min, Max, IsOptional } from 'class-validator'
import { _Params, _Config } from './definition'

const _ParamsKeys: Record<keyof _Params, true> = {
    options: true,
    validation: true,
    swagger: true,
}
function _isParams(params: any) {
    for (const key in _ParamsKeys) {
        if (params[key]) {
            return true
        }
    }
    return false
}
export function _ArgHelper<T = any>(args: any[]) {
    let config: _Config = {}
    let params: _Params<T> = {
        options: {} as T,
        swagger: {},
        validation: {},
    }
    if (args.length === 1) {
        if (_isParams(args[0])) {
            params = Object.assign(params, args[0])
        } else {
            config = args[0]
        }
    } else if (args.length === 2) {
        config = args[0]
        params = Object.assign(params, args[1])
    }
    return { config, params }
}

/** 映射表: 配置项 -> Class Validator 装饰器 */
const ConfigToValidator: Record<
    OmitUnion<keyof _Config, 'required' | 'enumName' | 'enumType'>,
    (...agrs: any[]) => PropertyDecorator
> = {
    min: Min,
    max: Max,
    // minLen: MinLength,
    // maxLen: MaxLength,
}
export function _DecoratorHelper(config: _Config, params: _Params) {
    const { required = false, ..._config } = config
    const { validation, swagger } = params || {}

    const decorators: PropertyDecorator[] = []

    if (!required) {
        decorators.push(ApiPropertyOptional(swagger), IsOptional(validation))
    } else {
        decorators.push(ApiProperty(swagger))
    }

    for (const [key, value] of Object.entries(_config)) {
        const validator = ConfigToValidator[key]
        if (validator) {
            decorators.push(validator(value, validation))
        }
    }

    return decorators
}
