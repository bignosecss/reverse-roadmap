import { IsNotEmpty, IsString } from 'class-validator';

export class SwitchModeDto {
  @IsString()
  @IsNotEmpty()
  password!: string;
}
