import { IsNotEmpty, IsString } from 'class-validator';

export class OllamaEmbeddingRequestDto {
  @IsNotEmpty()
  @IsString()
  model!: string;

  @IsNotEmpty()
  @IsString()
  input!: string | string[];
}
