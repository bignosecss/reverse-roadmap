import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SwitchModeDto } from './dto/switch-mode.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('switch-mode')
  @HttpCode(HttpStatus.OK)
  switchMode(@Body() switchModeDto: SwitchModeDto) {
    const isValid = this.authService.validatePassword(switchModeDto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid password.');
    }
    return { success: true, message: 'Authentication successful.' };
  }
}
