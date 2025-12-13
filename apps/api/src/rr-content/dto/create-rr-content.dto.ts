import { CreateRrContentDto as SharedCreateRrContentDto } from '@repo/shared/dto';

export class CreateRrContentDto implements SharedCreateRrContentDto {
  tabTitle!: string; // Note: This field is not in the shared definition
  type!: 'doc';
  content!: any[];
}
