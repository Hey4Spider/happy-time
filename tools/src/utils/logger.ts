import { APPLICATION, Logger, LogLevel } from '@node/logger'

export const logger = new Logger(LogLevel.Debug, {
    [APPLICATION]: 'Tools',
})
