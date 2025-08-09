import { PartialType } from '@nestjs/mapped-types';
import { CreateRrTreeDto } from './create-rr-tree.dto';

export class UpdateRrTreeDto extends PartialType(CreateRrTreeDto) {}
