import { PartialType } from '@nestjs/mapped-types';
import { CreateRrNodeDto } from './create-rr-node.dto';

export class UpdateRrNodeDto extends PartialType(CreateRrNodeDto) {}
