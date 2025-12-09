import { UpdateRrNodeDto as SharedUpdateRrNodeDto } from '@repo/shared/dto';
import { RrNodeStatus } from '@repo/shared/models';

export class UpdateRrNodeDto implements SharedUpdateRrNodeDto {
  title!: string;
  description?: string;
  parent!: string | null;
  status?: RrNodeStatus;
}
