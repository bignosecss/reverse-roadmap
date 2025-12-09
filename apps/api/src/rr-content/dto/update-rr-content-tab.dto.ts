import { UpdateRrContentTabDto as SharedUpdateRrContentTabDto } from '@repo/shared/dto';

export class UpdateRrContentTabDto implements SharedUpdateRrContentTabDto {
  rrContent!: string;
  tabTitle!: string;
}
