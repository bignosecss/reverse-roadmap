import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteNodeDto {
  @IsNotEmpty()
  @IsString()
  nodeId!: string;

  @IsNotEmpty()
  @IsString()
  rootId!: string;
}
