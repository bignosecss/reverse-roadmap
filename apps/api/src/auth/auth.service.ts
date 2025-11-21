import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  validatePassword(password: string): boolean {
    const serverPassword = this.configService.get<string>('TOGGLE_MODE');
    return password === serverPassword;
  }
}
