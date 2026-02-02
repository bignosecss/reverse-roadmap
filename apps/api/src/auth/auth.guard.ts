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
    const { path, method } = request;
    const session: SessionData = request.session || {};

    // 已登录，直接放行所有操作
    if (session && session.userId) {
      return true;
    }

    // 未登录，只允许白名单中的 GET 请求
    if (method === 'GET' && AuthPathMatcher.isWhitelisted(path)) {
      return true;
    }

    // 其他情况拒绝访问
    throw new UnauthorizedException('请先登录');
  }
}
