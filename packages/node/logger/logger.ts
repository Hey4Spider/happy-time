import { isBaseType } from '@shared'
import * as Winston from 'winston'
import { APPLICATION, CATEGORY, LoggerMeta, LogLevel } from './deinition'
import { colorString } from './helper'
import { SPLAT } from 'triple-beam'

export class Logger {
    private logger: Winston.Logger

    constructor(logLevel = LogLevel.Warn, meta: LoggerMeta = {}) {
        this.logger = Winston.createLogger({
            level: logLevel,
            defaultMeta: {
                [APPLICATION]: 'Application',
                [CATEGORY]: 'Logger',
                ...meta,
            },
            transports: [new Winston.transports.Console()],
            format: Winston.format.combine(
                Winston.format.timestamp(),
                Winston.format.json(),
                Winston.format.simple(),
                Winston.format.printf(
                    ({ level, message, timestamp, ...options }) => {
                        const _level = level as LogLevel
                        const APP = options[APPLICATION] as string
                        const CATE = options[CATEGORY] as string

                        const sApp = `[${APP}]`
                        const sLevel = colorString(
                            level.toUpperCase().padEnd(8, ' '),
                            _level,
                        )
                        const sCate = `[${CATE}]`

                        let prevIsObj = false
                        const msgList = [message]
                        if (options[SPLAT]) {
                            msgList.push(...(options[SPLAT] as unknown[]))
                        }
                        const msgLen = msgList.length
                        for (let i = 0; i < msgLen; ++i) {
                            const prefix = prevIsObj ? '\n' : ''
                            const msg = msgList[i]
                            if (isBaseType(msg)) {
                                msgList[i] = prefix + String(msg)
                                prevIsObj = false
                            } else if (msg instanceof Error) {
                                msgList[i] =
                                    prefix + msg.message + '\n' + msg.stack
                                prevIsObj = true
                            } else {
                                msgList[i] =
                                    (i === 0 ? '' : '\n') +
                                    JSON.stringify(msg, null, 4)
                                prevIsObj = true
                            }
                        }
                        const sMsg = colorString(msgList.join(' '), _level)
                        return `${sApp} ${sLevel} ${timestamp} -- ${sCate} ${sMsg}`
                    },
                ),
            ),
        })
    }

    get defaultMeta() {
        return this.logger.defaultMeta
    }

    private _setMeta(meta: Recordable) {
        this.logger.defaultMeta = Object.assign(this.logger.defaultMeta, meta)
    }

    setCategory(category: string) {
        this._setMeta({ [CATEGORY]: category })
    }

    setApplication(application: string) {
        this._setMeta({ [APPLICATION]: application })
    }

    error(message: any, ...meta: any[]) {
        this.logger.error(message, ...meta)
    }

    warn(message: any, ...meta: any[]) {
        this.logger.warn(message, ...meta)
    }

    info(message: any, ...meta: any[]) {
        this.logger.info(message, ...meta)
    }

    verbose(message: any, ...meta: any[]) {
        this.logger.verbose(message, ...meta)
    }

    debug(message: any, ...meta: any[]) {
        this.logger.debug(message, ...meta)
    }
}
