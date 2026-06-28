import { Injectable, LoggerService, Scope } from '@nestjs/common'
import { APPLICATION, Logger } from '@node/logger'
import { LogLevel } from '@shared'

@Injectable({ scope: Scope.TRANSIENT })
export class NestLogger extends Logger implements LoggerService {
    constructor() {
        const { LEVEL } = process.env
        const logLevel = (LEVEL as LogLevel) || LogLevel.Warn
        super(logLevel, {
            [APPLICATION]: 'Backend',
        })
    }

    fatal(message: any, ...optionalParams: any[]) {
        this.error(message, ...optionalParams)
    }

    log(message: any, ...optionalParams: any[]) {
        this.info(message, ...optionalParams)
    }
}
