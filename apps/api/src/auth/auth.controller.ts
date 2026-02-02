import {
  Controller,
  Post,
  Body,
  Get,
  Session,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.dto';

interface SessionData {
  userId?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: CreateUserDto, @Session() session: SessionData) {
    const result = this.authService.login(loginDto);
    session.userId = result.user._id;
    return { user: result.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Session() session: SessionData) {
    session.userId = undefined;
    return { message: '登出成功' };
  }

  @Get('me')
  getCurrentUser(@Session() session: SessionData) {
    if (!session.userId) {
      throw new UnauthorizedException('未登录');
    }
    const user = this.authService.getCurrentUser(session.userId);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return { user };
  }
}
