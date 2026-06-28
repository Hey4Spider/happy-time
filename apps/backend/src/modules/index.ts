import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { UtilsModule } from './utils'
import { ApisModule } from './apis'
import { HttpExceptionFilter } from '@/utils'

@Module({
    imports: [UtilsModule, ApisModule],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
