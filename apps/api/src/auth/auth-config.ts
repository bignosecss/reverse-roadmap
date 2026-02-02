/**
 * 权限管理配置
 * 定义白名单和需要登录认证的路由路径
 */

export interface AuthConfig {
  whitelist: string[]; // 白名单路径，不需要登录认证
  protectedPaths: string[]; // 需要登录认证的路径模式
}

/**
 * 默认权限配置
 */
export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  // 白名单路径（不需要登录认证）
  // 正则表达式匹配，支持 * 通配符
  whitelist: [
    '^/api/auth/login$', // 登录
    '^/api/auth/register$', // 注册
    '^/api/auth/logout$', // 登出
    '^/api/auth/me$', // 获取当前用户信息
    '^/api/rr-root/public$', // 公开的根节点
    '^/api/health$', // 健康检查（如果存在）
    '^/api/docs$', // API文档（如果存在）
  ],

  // 需要登录认证的路径模式
  // 其他所有未明确列出的路径都需要认证
  protectedPaths: [
    '^/api/.*$', // 所有以 /api/ 开头的路径都需要认证（除了白名单）
  ],
};

/**
 * 权限管理工具类
 */
export class AuthPathMatcher {
  /**
   * 检查路径是否在白名单中
   */
  static isWhitelisted(
    path: string,
    config: AuthConfig = DEFAULT_AUTH_CONFIG,
  ): boolean {
    return config.whitelist.some((pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(path);
    });
  }

  /**
   * 检查路径是否需要认证
   */
  static isProtected(
    path: string,
    config: AuthConfig = DEFAULT_AUTH_CONFIG,
  ): boolean {
    // 如果在白名单中，不需要认证
    if (this.isWhitelisted(path, config)) {
      return false;
    }

    // 检查是否在保护路径列表中
    return config.protectedPaths.some((pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(path);
    });
  }
}
