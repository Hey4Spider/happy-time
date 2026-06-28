import { Prisma } from '@node/database'
import type { Database } from '.'
import type { NestLogger } from '../logger'
import { isString } from 'class-validator'
import { format } from 'sql-formatter'

export function _initLogger(db: Database, logger: NestLogger) {
    db.$on('query', ({ query, params, duration }: Prisma.QueryEvent) => {
        // 若 SQL 执行时间超过 1s, 则强制打印 SQL 信息
        const forcePrint = duration >= 1000
        let levelQuery = 'debug'
        let levelTime = 'verbose'
        if (forcePrint) {
            logger.warn('Slow SQL')
            levelQuery = 'warn'
            levelTime = 'warn'
        }

        const paramsArr = JSON.parse(params.replaceAll('\n', '')).map(
            (item: unknown) => (isString(item) ? `"${item}"` : String(item)),
        )
        paramsArr.unshift('')
        logger[levelQuery](
            'SQL Executed:\n',
            format(query, {
                language: 'postgresql',
                keywordCase: 'upper',
                dataTypeCase: 'upper',
                functionCase: 'upper',
                logicalOperatorNewline: 'before',
                denseOperators: false,
                newlineBeforeSemicolon: false,
                params: paramsArr,
            }),
        )
        logger[levelTime](`SQL Executed Duration: ${duration}ms`)
    })

    db.$on('info', ({ timestamp, message, target }: Prisma.LogEvent) => {
        logger.info(timestamp)
        logger.info(message)
        logger.info(target)
    })
    db.$on('warn', ({ timestamp, message, target }: Prisma.LogEvent) => {
        logger.warn(timestamp)
        logger.warn(message)
        logger.warn(target)
    })
    db.$on('error', ({ timestamp, message, target }: Prisma.LogEvent) => {
        logger.error(timestamp)
        logger.error(message)
        logger.error(target)
    })
}
