import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@node/database'
import { NestLogger } from '../logger'
import { _initLogger } from './logger'
import { _initExtends } from './extends'
import { PrismaPg } from '@prisma/adapter-pg'
import { _LogOptions } from './definition'

@Injectable()
export class Database
    extends PrismaClient<Prisma.PrismaClientOptions & typeof _LogOptions>
    implements OnModuleInit, OnModuleDestroy
{
    readonly ExtendDb!: ReturnType<typeof _initExtends>

    constructor(private readonly logger: NestLogger) {
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
            application_name: 'HappyTime',
        })
        super({
            adapter,
            ..._LogOptions,
        })

        this.logger.setCategory(Database.name)
        _initLogger(this, logger)
        this.ExtendDb = _initExtends(this)
    }

    async onModuleInit() {
        await this.$connect()
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}
