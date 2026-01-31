import {
  IsString,
  ValidateIf,
  IsEnum,
  IsOptional,
  IsDefined,
  IsBoolean,
} from 'class-validator';
import { CreateRrNodeDto as SharedCreateRrNodeDto } from '@repo/shared/dto';
import { RrNodeStatus } from '@repo/shared/models';

export class CreateRrNodeDto implements SharedCreateRrNodeDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDefined()
  @ValidateIf((o: CreateRrNodeDto) => o.parent !== null)
  @IsString()
  parent!: string | null;

  @IsEnum(RrNodeStatus)
  @IsOptional()
  status?: RrNodeStatus;

  @IsBoolean()
  @IsOptional()
  excludeFromRAG?: boolean;
}
