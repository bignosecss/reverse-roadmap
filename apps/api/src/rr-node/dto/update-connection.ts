import { IsArray } from 'class-validator';
import { FlowNode } from '@repo/shared/flow';
import { UpdateConnectionDto as SharedUpdateConnectionDto } from '@repo/shared';

export class UpdateConnectionDto implements SharedUpdateConnectionDto {
  @IsArray()
  nodes!: FlowNode[];
}
