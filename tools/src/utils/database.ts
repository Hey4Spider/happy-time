import { PrismaClient } from '@node/database'
import { PrismaPg } from '@prisma/adapter-pg'
import { format } from 'sql-formatter'

const {
    // New Line
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
} = process.env
const adapter = new PrismaPg({
    max: 20,
    min: 5,
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    application_name: 'Nic-Tools',
})
export const db = new PrismaClient({
    adapter,
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
    ],
})

db.$on('query', ({ query, params, duration }) => {
    if (['BEGIN', 'COMMIT', 'ROLLBACK'].includes(query)) {
        return
    }
    try {
        const fmtQuery = format(query, {
            language: 'postgresql',
            keywordCase: 'upper',
            dataTypeCase: 'upper',
            functionCase: 'upper',
            params: Object.fromEntries(
                JSON.parse(params).map((item: unknown, index: number) => [
                    String(index + 1),
                    typeof item === 'string' ? `'${item}'` : String(item),
                ]),
            ),
        })
        console.log('Query: ' + fmtQuery)
        console.log('Duration: ' + duration + 'ms')
    } catch (e) {
        console.error(e)

        console.log('Query: ' + query)
        console.log('Params: ' + params)
        console.log('Duration: ' + duration + 'ms')
    }
})
