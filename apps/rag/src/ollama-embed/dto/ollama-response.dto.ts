import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class OllamaEmbeddingResponseDto {
  @IsString()
  model!: string;

  @IsArray()
  @ArrayNotEmpty()
  embeddings!: number[][];

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  total_duration!: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  load_duration!: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  prompt_eval_count!: number;
}
