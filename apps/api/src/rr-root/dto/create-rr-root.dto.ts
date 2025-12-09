import { IsString, IsEnum } from 'class-validator';
import { CreateRrRootDto as SharedCreateRrRootDto } from '@repo/shared/dto';
import { RrRootStatus } from '@repo/shared/models';

export class CreateRrRootDto implements SharedCreateRrRootDto {
  @IsString()
  title!: string;

  @IsString()
  description?: string;

  @IsEnum(RrRootStatus)
  status!: RrRootStatus;
}
