import { UpdateRrRootDto as SharedUpdateRrRootDto } from '@repo/shared/dto';
import { RrRootStatus } from '@repo/shared/models';

export class UpdateRrRootDto implements SharedUpdateRrRootDto {
  title!: string;
  description?: string;
  status!: RrRootStatus;
}
