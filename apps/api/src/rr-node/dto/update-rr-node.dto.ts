import { IsNotEmpty, IsString } from 'class-validator';
import { CreateRrNodeDto } from './create-rr-node.dto';

export class UpdateRrNodeDto extends CreateRrNodeDto {
  @IsNotEmpty()
  @IsString()
  nodeId!: string;
}
