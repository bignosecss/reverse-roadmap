import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/user.dto';

// Reverse Roadmap 只有一个用户，使用单一对象存储
let user: UserDto | null = null;

@Injectable()
export class AuthService {
  login(dto: CreateUserDto): { user: UserDto } {
    if (!user) {
      throw new UnauthorizedException('用户不存在，请先注册');
    }

    if (user.username !== dto.username || user.password !== dto.password) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    return { user };
  }

  register(dto: CreateUserDto): { user: UserDto } {
    if (user) {
      throw new ConflictException('用户已存在');
    }

    user = {
      _id: '1',
      username: dto.username,
      password: dto.password,
    };

    return { user };
  }

  getCurrentUser(userId: string): UserDto | null {
    return user?._id === userId ? user : null;
  }
}
