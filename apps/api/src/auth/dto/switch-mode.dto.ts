import { IsNotEmpty, IsString } from 'class-validator';
import { SwitchModeDto as SharedSwitchModeDto } from '@repo/shared/dto';

export class SwitchModeDto implements SharedSwitchModeDto {
  @IsString()
  @IsNotEmpty()
  password!: string;
}
