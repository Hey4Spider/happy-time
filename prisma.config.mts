import { configDotenv } from 'dotenv'
import path from 'node:path'
import { defineConfig } from 'prisma/config'

const PathEnv = path.join(__dirname, 'config/node/.env')

const mode = process.env.MODE || process.env.NODE_ENV
const envList = [`${PathEnv}.local`, PathEnv]
if (mode) {
    envList.unshift(`${PathEnv}.${mode}.local`, `${PathEnv}.${mode}`)
}
configDotenv({ path: envList })

process.env.DB_CLIENT_PATH = path.join(__dirname, 'packages/node/prisma')

const {
    // New Line
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    DB_SCHEMA,
} = process.env
const DirDb = path.join(__dirname, 'database')
export default defineConfig({
    datasource: {
        url: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=${DB_SCHEMA}`,
    },
    schema: `${DirDb}/schema`,
    migrations: {
        path: `${DirDb}/migrations`,
    },
    // views: {
    //     path: `${DirDb}/views`,
    // },
    typedSql: {
        path: `${DirDb}/queries`,
    },
})
