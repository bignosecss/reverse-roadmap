import {
  IsDefined,
  IsString,
  ValidateIf,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { RrNodeStatus } from '../schemas/rr-node.schema';

export class CreateRrNodeDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDefined() // 确保字段必须存在
  @ValidateIf((o: CreateRrNodeDto) => o.parent !== null) // 如果不是null，就验证为字符串
  @IsString()
  parent!: string | null;

  @IsEnum(RrNodeStatus)
  @IsOptional()
  status?: RrNodeStatus;
}
