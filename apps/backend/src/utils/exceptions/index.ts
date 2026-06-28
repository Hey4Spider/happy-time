import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common'
import { NestLogger } from '../providers'
import { FastifyReply } from 'fastify'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: NestLogger) {
        this.logger.setCategory(HttpExceptionFilter.name)
    }

    async catch(exception: any, host: ArgumentsHost) {
        this.logger.error(exception.stack)
        const ctx = host.switchToHttp()
        const res = ctx.getResponse<FastifyReply>()

        let status = 500
        let message = 'Error Not Catch'
        if (exception instanceof HttpException) {
            status = exception.getStatus()
            const data = exception.getResponse() as Recordable
            message = data.message
        } else {
            this.logger.error('Request Failure')
            this.logger.error(exception)
        }
        return res.code(status).send({ message })
    }
}
