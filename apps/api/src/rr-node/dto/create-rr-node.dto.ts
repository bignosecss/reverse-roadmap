import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRrNodeDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsString()
  parentId!: string;

  @IsNotEmpty()
  @IsString()
  rootId!: string;
}
