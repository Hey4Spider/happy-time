import { Database, NestLogger } from '@/utils'
import { Global, Module, Provider } from '@nestjs/common'

const providers: Provider[] = [Database, NestLogger]

@Global()
@Module({
    imports: [],
    controllers: [],
    providers,
    exports: providers,
})
export class UtilsModule {}
