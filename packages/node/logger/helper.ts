import { LogLevel } from '@shared'

export const ColorCode = {
    [LogLevel.Error]: '91', // red
    [LogLevel.Warn]: '93', // yellow
    [LogLevel.Info]: '92', // green
    [LogLevel.Http]: '92', // green
    [LogLevel.Verbose]: '96', // cyan
    [LogLevel.Debug]: '95', // magenta
    [LogLevel.Silly]: '95', // magenta
    // blue: '94', // blue
}

export const colorString = (message: string, level = LogLevel.Info) => {
    const code = ColorCode[level]
    if (!level || !code) {
        return message
    }
    return `\x1b[${code}m${message}\x1b[0m`
}
