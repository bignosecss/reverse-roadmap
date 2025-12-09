import { UpdateRrContentDto as SharedUpdateRrContentDto } from '@repo/shared/dto';

export class UpdateRrContentDto implements SharedUpdateRrContentDto {
  type!: 'doc';
  content!: any[];
}
