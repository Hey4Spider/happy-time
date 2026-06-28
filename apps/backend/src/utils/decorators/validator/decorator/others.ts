import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator'
import { Readable } from 'node:stream'
import { _ArgHelper, _DecoratorHelper, _Overloads } from '../utils'
import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { MultipartFile } from '@fastify/multipart'

export function IsFile(options?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsFile',
            target: object.constructor,
            propertyName: propertyName,
            options: options,
            validator: {
                validate(value: MultipartFile) {
                    return (
                        value.type === 'file' &&
                        !!value.mimetype &&
                        value.file instanceof Readable
                    )
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a file`
                },
            },
        })
    }
}

export const IsFileData: _Overloads = (...args: any[]) => {
    const { config, params } = _ArgHelper(args)
    return applyDecorators(
        Transform(({ value }) => (Array.isArray(value) ? value : [value])),
        ..._DecoratorHelper(config, params),
    )
}
