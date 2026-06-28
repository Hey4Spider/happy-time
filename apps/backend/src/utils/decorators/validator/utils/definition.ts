import { ApiPropertyOptions } from '@nestjs/swagger'
import { ValidationOptions } from 'class-validator'

export interface _Config {
    required?: boolean
    min?: number
    max?: number
    // minLen?: number
    // maxLen?: number
    enumName?: string
    enumType?: 'string' | 'number'
}

export interface _Params<T = any> {
    options?: T
    validation?: ValidationOptions
    swagger?: ApiPropertyOptions
}

export type _Overloads<
    T = any,
    C extends _Config = _Config,
    P extends _Params = _Params<T>,
> = {
    (config?: C): PropertyDecorator
    (params?: P): PropertyDecorator
    (config: C, params?: P): PropertyDecorator
}

export type _OverloadsWithData<
    D extends object = object,
    T = any,
    C extends _Config = _Config,
    P extends _Params = _Params<T>,
> = {
    (data: D, config?: C): PropertyDecorator
    (data: D, params?: P): PropertyDecorator
    (data: D, config: C, params?: P): PropertyDecorator
}

export type _OverloadsWithEnum<
    D extends object = object,
    T = any,
    C extends _Config = _Config,
    P extends _Params = _Params<T>,
> = {
    (data: D, name: string, config?: C): PropertyDecorator
    (data: D, name: string, params?: P): PropertyDecorator
    (data: D, name: string, config: C, params?: P): PropertyDecorator
}
