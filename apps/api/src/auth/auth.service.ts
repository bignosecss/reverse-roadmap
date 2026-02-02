import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  private getUser(): UserDto {
    return {
      _id: '1',
      username: this.configService.get<string>('ADMIN_USERNAME', 'admin'),
      password: this.configService.get<string>('ADMIN_PASSWORD', 'admin123'),
    };
  }

  login(dto: CreateUserDto): { user: UserDto } {
    const user = this.getUser();
    if (user.username !== dto.username || user.password !== dto.password) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    return { user };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register(dto: CreateUserDto): { user: UserDto } {
    throw new ConflictException('已存在唯一用户');
  }

  getCurrentUser(userId: string): UserDto | null {
    const user = this.getUser();
    return user._id === userId ? user : null;
  }
}
