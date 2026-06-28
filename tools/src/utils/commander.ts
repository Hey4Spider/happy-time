import * as fs from 'node:fs'
import { Command, CommandOptions, program as Program } from 'commander'

interface ProgramParams {
    program?: Command
    afterHelp?: (...args: any[]) => void
    name?: string
    usage?: string
    description?: string
    action?: (...args: any[]) => void
}
export function initProgram({
    program,
    afterHelp,
    ...others
}: ProgramParams = {}) {
    const helpMessage = '显示帮助信息'
    const _program = (program || Program)
        .helpOption('-h, --help', helpMessage)
        .helpCommand('help', helpMessage)
    for (const key in others) {
        _program[key](others[key])
    }
    _program.on('--help', () => {
        if (afterHelp) {
            afterHelp()
        }
    })
    return _program
}

export function newCommand(
    nameAndArgs: string,
    {
        options,
        ...others
    }: {
        options?: CommandOptions
    } & ProgramParams = {},
) {
    const cmd = new Command().command(nameAndArgs, options)
    return initProgram({
        ...others,
        program: cmd,
    })
}

export async function loadCommand(cmdDir: string, program?: Command) {
    const fileList = fs
        .readdirSync(cmdDir)
        .filter(item => item[0] !== '_' && item.endsWith('.ts'))
    return await Promise.all(
        fileList.map(async file => {
            const module = await import(`${cmdDir}/${file}`)
            if (program) {
                program.addCommand(module.default)
            }
            return module.default
        }),
    )
}
