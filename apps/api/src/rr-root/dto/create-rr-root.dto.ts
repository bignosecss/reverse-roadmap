import { IsString } from 'class-validator';

export class CreateRrRootDto {
  @IsString()
  title!: string;

  @IsString()
  description?: string;
}
