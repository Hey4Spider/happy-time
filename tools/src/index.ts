import * as path from 'node:path'
import { db, initProgram, loadCommand } from './utils'

void (async () => {
    try {
        await db.$connect()

        const program = initProgram({
            name: 'happy',
            usage: '<COMMAND> [options]',
        })
        const cmdDir = path.join(__dirname, './modules')
        await loadCommand(cmdDir, program)
        program.parse()
    } catch (e) {
        console.error(e)
    } finally {
        await db.$disconnect()
    }
})()
