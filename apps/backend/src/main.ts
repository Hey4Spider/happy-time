import { NestFactory } from '@nestjs/core'
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify'
import FastifyMultipart from '@fastify/multipart'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './modules'
import { NestLogger } from './utils'
import { WorkspacesService } from './services'

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            bufferLogs: true,
            forceCloseConnections: true,
        },
    )
    const logger = await app.resolve(NestLogger)

    initCors(app)
    initPipe(app)
    initApi(app)
    initSwagger(app)
    initStatic(app, logger)

    const port = Number(process.env.PORT ?? 3000)
    await app.listen(port)
    logger.info(`Application is running on:`, port)
}
function initCors(app: NestFastifyApplication) {
    app.enableCors({
        origin: true,
        credentials: true,
        methods: '*',
        allowedHeaders: '*',
        exposedHeaders: '*',
    })
}
function initPipe(app: NestFastifyApplication) {
    app.register(FastifyMultipart, {
        attachFieldsToBody: true,
    })
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            validateCustomDecorators: true,
        }),
    )
}
function initApi(app: NestFastifyApplication) {
    app.setGlobalPrefix('api')
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    })
}
function initSwagger(app: NestFastifyApplication) {
    const config = new DocumentBuilder().setTitle('Happy Time').build()
    const document = SwaggerModule.createDocument(app, config, {
        operationIdFactory: (_, funcName: string, version?: string) => {
            if (!version || version === 'v1') {
                return funcName
            } else {
                return `${funcName}${version.toUpperCase()}`
            }
        },
    })
    SwaggerModule.setup('/api', app, document)
}
function initStatic(app: NestFastifyApplication, logger: NestLogger) {
    // 设置静态资源目录
    const { list } = app
        .select(AppModule)
        .get(WorkspacesService)
        .listWorkspace()
    for (const { path, key } of list) {
        app.useStaticAssets({
            root: path,
            prefix: `/${key}/`,
            decorateReply: false,
        })
        logger.info(`Set static path: /${key} - ${path}`)
    }
}

bootstrap()
