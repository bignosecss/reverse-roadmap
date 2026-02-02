import {
  UserDto as SharedUserDto,
  CreateUserDto as SharedCreateUserDto,
} from '@repo/shared';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class UserDto implements SharedUserDto {
  @IsString()
  _id!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class CreateUserDto implements SharedCreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
