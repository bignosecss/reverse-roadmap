import { IsString } from 'class-validator';

export class CreateRrNodeDto {
  @IsString()
  title!: string;

  @IsString()
  description?: string;

  @IsString()
  parent?: string;
}
