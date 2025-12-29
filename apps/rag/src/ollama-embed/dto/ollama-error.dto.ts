import { IsNotEmpty, IsString } from 'class-validator';

export class OllamaErrorResponseDto {
  @IsString()
  @IsNotEmpty()
  error!: string;
}
