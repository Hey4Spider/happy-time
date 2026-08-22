import { NestFactory } from '@nestjs/core'
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify'
import FastifyMultipart from '@fastify/multipart'
import FastifyStatic from '@fastify/static'
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
    await initStatic(app, logger)

    const port = Number(process.env.PORT ?? 3000)
    await app.listen(port, '0.0.0.0')
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
async function initStatic(app: NestFastifyApplication, logger: NestLogger) {
    const workspaces = app.get(WorkspacesService)
    const { list } = workspaces.listWorkspace()

    await app.register(FastifyStatic, { serve: false })
    app.getHttpAdapter()
        .getInstance()
        .get<{
            Params: {
                workspace: string
                '*': string
            }
        }>('/:workspace/*', (request, reply) => {
            const key = request.params.workspace
            const file = request.params['*']
            if (key === 'api' || !file) {
                return reply.callNotFound()
            }

            try {
                const workspace = workspaces.getWorkspace(key)
                if (!workspace.isActive) {
                    return reply.callNotFound()
                }
                return reply.sendFile(file, workspace.path)
            } catch {
                return reply.callNotFound()
            }
        })

    for (const { key, path, isActive } of list) {
        if (!isActive) {
            continue
        }
        logger.info(`Set static path: /${key} - ${path}`)
    }
}

bootstrap()
