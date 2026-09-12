import { OmitType, PartialType } from '@nestjs/swagger'
import { IsNotEmptyString } from '@/utils'

export class CreateWorkspaceDto {
    @IsNotEmptyString({ required: true })
    key!: string

    @IsNotEmptyString({ required: true })
    path!: string

    @IsNotEmptyString({ required: true })
    trash!: string
}

export class UpdateWorkspaceDto extends PartialType(
    OmitType(CreateWorkspaceDto, ['key'] as const),
) {}
