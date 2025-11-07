import { IsDefined, IsString, ValidateIf } from 'class-validator';

export class CreateRrNodeDto {
  @IsString()
  title!: string;

  @IsString()
  description?: string;

  @IsDefined() // 确保字段必须存在
  @ValidateIf((o: CreateRrNodeDto) => o.parent !== null) // 如果不是null，就验证为字符串
  @IsString()
  parent!: string | null;
}
