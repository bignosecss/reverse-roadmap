import { UpdateRrNodeDto as SharedUpdateRrNodeDto } from '@repo/shared/dto';
import { RrNodeStatus } from '@repo/shared/models';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class NodeContentOrderDto {
  @IsNotEmpty()
  @IsString()
  _id!: string;

  @IsNotEmpty()
  @IsString()
  rrContent!: string;

  @IsNotEmpty()
  @IsString()
  tabTitle!: string;
}

export class UpdateRrNodeDto implements SharedUpdateRrNodeDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  parent?: string | null;

  @IsEnum(RrNodeStatus)
  @IsOptional()
  status?: RrNodeStatus;

  @IsBoolean()
  @IsOptional()
  excludeFromRAG?: boolean;

  @IsArray()
  @IsOptional()
  content?: NodeContentOrderDto[];
}
