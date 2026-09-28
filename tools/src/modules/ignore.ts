import * as fs from 'node:fs'
import * as path from 'node:path'
import { ResourceStatus } from '@shared'
import { db, newCommand } from 'src/utils'

const KeysLine = fs
    .readFileSync(path.join(__dirname, 'data/ignore.txt'), 'utf-8')
    .toString()
    .trim()
    .split('\n')
const Keys: string[] = []
for (const key of KeysLine) {
    if (key.startsWith('// ')) {
        continue
    }
    Keys.push(key)
}

export default newCommand('ignore', {
    description: '忽略资源',
    action,
})

async function action() {
    await db.misskon.updateMany({
        where: {
            OR: Keys.map(item => ({
                name: {
                    startsWith: item,
                },
            })),
            status: ResourceStatus.Undownload,
        },
        data: {
            status: ResourceStatus.CanDownload,
        },
    })
    await db.$disconnect()
}
