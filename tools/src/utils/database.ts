import { PrismaClient } from '@node/database'
import { PrismaPg } from '@prisma/adapter-pg'

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
export const db = new PrismaClient({ adapter })
