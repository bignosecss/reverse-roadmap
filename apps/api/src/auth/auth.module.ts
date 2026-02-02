import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { DEFAULT_AUTH_CONFIG } from './auth-config';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: 'AUTH_CONFIG',
      useValue: DEFAULT_AUTH_CONFIG,
    },
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
