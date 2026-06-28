import { applyDecorators } from '@nestjs/common'
import { IsString, IsNotEmpty } from 'class-validator'
import { _Overloads, _ArgHelper, _DecoratorHelper } from '../utils'

export const IsNotEmptyString: _Overloads = (...args: any[]) => {
    const { config, params } = _ArgHelper(args)
    return applyDecorators(
        IsString(params.validation),
        IsNotEmpty(params.validation),
        ..._DecoratorHelper(config, params),
    )
}
