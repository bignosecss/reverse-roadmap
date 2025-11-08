import { PartialType } from '@nestjs/mapped-types';
import { CreateRrContentDto } from './create-rr-content.dto';

export class UpdateRrContentDto extends PartialType(CreateRrContentDto) {}
