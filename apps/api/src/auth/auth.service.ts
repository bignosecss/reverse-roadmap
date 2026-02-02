import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/user.dto';

// Reverse Roadmap 只有一个用户，使用单一对象存储
const user: UserDto = {
  _id: "1",
  username: "admin",
  password: "admin123",
};

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
    if (user && dto) {
      throw new ConflictException('已存在唯一用户');
    }

    return { user };
  }

  getCurrentUser(userId: string): UserDto | null {
    return user?._id === userId ? user : null;
  }
}
