/**
 * 权限管理配置
 * 定义白名单路径（未登录时只允许这些路径的 GET 请求）
 */

export interface AuthConfig {
  whitelist: string[]; // 白名单路径（未登录时只允许这些路径的 GET 请求）
}

/**
 * 默认权限配置
 */
export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  // 白名单路径（未登录时只允许这些路径的 GET 请求）
  // 正则表达式匹配，支持 * 通配符
  whitelist: [
    '^/api/auth/login$', // 登录
    '^/api/auth/register$', // 注册
    '^/api/auth/logout$', // 登出
    '^/api/auth/me$', // 获取当前用户信息

    // 公开 root （前端控制）及其相关资源的 GET 请求
    '^/api/rr-root$',
    '^/api/rr-node/flow-data/[a-f0-9]{24}$', // 获取 node 的 flow 数据
    '^/api/rr-content/[a-f0-9]{24}$', // 获取单个 content
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
}
