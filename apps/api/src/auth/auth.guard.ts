import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPathMatcher } from './auth-config';
import { Observable } from 'rxjs';

interface SessionData {
  userId?: string;
}

/**
 * 认证守卫
 * 检查用户是否已登录，保护需要认证的路由
 *
 * 基于路径的白名单和需要认证的路径
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.path;
    const session: SessionData = request.session || {};

    // 如果路径在白名单中，允许访问
    if (AuthPathMatcher.isWhitelisted(path)) {
      return true;
    }

    // 检查路径是否需要认证
    if (!AuthPathMatcher.isProtected(path)) {
      return true;
    }

    // 检查用户是否已登录
    const userId = session?.userId;
    if (!userId) {
      throw new UnauthorizedException('请先登录');
    }

    // 用户已登录，允许访问
    return true;
  }
}
