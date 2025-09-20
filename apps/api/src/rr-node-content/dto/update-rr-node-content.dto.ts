import { PartialType } from '@nestjs/mapped-types';
import { CreateRrNodeContentDto } from './create-rr-node-content.dto';

export class UpdateRrNodeContentDto extends PartialType(
  CreateRrNodeContentDto,
) {}
