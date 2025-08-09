import { PartialType } from '@nestjs/mapped-types';
import { CreateRrRootDto } from './create-rr-root.dto';

export class UpdateRrRootDto extends PartialType(CreateRrRootDto) {}
