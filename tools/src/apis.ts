import * as fs from 'node:fs'
import * as path from 'node:path'

const Dir = path.resolve(process.cwd(), 'packages/shared/apis')
const Skip = new Set(['index.ts', 'http-client.ts', 'data-contracts.ts'])

const modules = fs
    .readdirSync(Dir)
    .filter(name => name.endsWith('.ts') && !Skip.has(name))
    .flatMap(name => {
        const content = fs.readFileSync(path.join(Dir, name), 'utf8')
        const match = content.match(/export class (\w+)/)
        return match ? [match[1]!] : []
    })
    .sort()

if (!modules.length) {
    throw new Error(`No API modules found in ${Dir}`)
}

const content = `import { ApiConfig, HttpClient } from './http-client'
${modules.map(name => `import { ${name} } from './${name}'`).join('\n')}

export * from './data-contracts'

export class Apis<
    SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
${modules.map(name => `    readonly ${name}: ${name}<SecurityDataType>`).join('\n')}

    constructor(options: ApiConfig<SecurityDataType> = {}) {
        super(options)
${modules.map(name => `        this.${name} = new ${name}(this)`).join('\n')}
    }
}
`

fs.writeFileSync(path.join(Dir, 'index.ts'), content)
