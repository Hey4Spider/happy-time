import * as Controllers from '@/controllers'
import * as Services from '@/services'
import { Module } from '@nestjs/common'

@Module({
    controllers: Object.values(Controllers),
    providers: Object.values(Services),
})
export class ApisModule {}
