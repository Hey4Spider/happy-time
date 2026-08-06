import { IsNotEmptyString } from '@/utils'

export class LoginDto {
    @IsNotEmptyString({ required: true })
    password!: string
}
