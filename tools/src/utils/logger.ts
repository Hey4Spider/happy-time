import { APPLICATION, Logger } from '@node/logger'
import { LogLevel } from '@shared'

export const logger = new Logger(LogLevel.Debug, {
    [APPLICATION]: 'Tools',
})
