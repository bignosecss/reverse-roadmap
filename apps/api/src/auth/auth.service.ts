import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/user.dto';

const mockUser: UserDto = {
  _id: '123',
  username: 'admin',
  password: 'admin123',
};

@Injectable()
export class AuthService {
  login(dto: CreateUserDto): { user: UserDto } {
    if (
      dto.username !== mockUser.username ||
      dto.password !== mockUser.password
    ) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    return { user: mockUser };
  }

  getCurrentUser(userId: string): UserDto | null {
    if (userId === mockUser._id) {
      return mockUser;
    }
    return null;
  }
}
