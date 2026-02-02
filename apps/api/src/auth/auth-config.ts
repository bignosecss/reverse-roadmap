/**
 * 权限管理配置
 * 定义白名单路径（未登录时只允许这些路径的 GET 请求）
 */

export interface WhitelistItem {
  pattern: string; // 正则表达式模式
  methods?: string[]; // 允许的 HTTP 方法，未指定则允许所有方法
}

export interface AuthConfig {
  whitelist: WhitelistItem[]; // 白名单路径配置
}

/**
 * 默认权限配置
 */
export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  // 白名单路径配置
  // 正则表达式匹配，支持指定允许的 HTTP 方法
  whitelist: [
    { pattern: '^/api/auth/login$', methods: ['POST'] }, // 登录
    { pattern: '^/api/auth/register$', methods: ['POST'] }, // 注册
    { pattern: '^/api/auth/logout$', methods: ['POST'] }, // 登出
    { pattern: '^/api/auth/me$', methods: ['GET'] }, // 获取当前用户信息

    // 公开 root （前端控制）及其相关资源的 GET 请求
    { pattern: '^/api/rr-root$', methods: ['GET'] },
    { pattern: '^/api/rr-node/flow-data/[a-f0-9]{24}$', methods: ['GET'] }, // 获取 node 的 flow 数据
    { pattern: '^/api/rr-content/[a-f0-9]{24}$', methods: ['GET'] }, // 获取单个 content
  ],
};

/**
 * 权限管理工具类
 */
export class AuthPathMatcher {
  /**
   * 检查路径是否在白名单中
   * @deprecated 使用 isPathAndMethodWhitelisted 替代
   */
  static isWhitelisted(
    path: string,
    config: AuthConfig = DEFAULT_AUTH_CONFIG,
  ): boolean {
    return config.whitelist.some((item) => {
      const regex = new RegExp(item.pattern);
      return regex.test(path);
    });
  }

  /**
   * 检查路径和HTTP方法是否在白名单中
   */
  static isPathAndMethodWhitelisted(
    path: string,
    method: string,
    config: AuthConfig = DEFAULT_AUTH_CONFIG,
  ): boolean {
    return config.whitelist.some((item) => {
      const regex = new RegExp(item.pattern);
      if (!regex.test(path)) return false;

      // 如果未指定 methods，则允许所有方法
      if (!item.methods || item.methods.length === 0) return true;

      // 检查方法是否在允许列表中
      return item.methods.includes(method);
    });
  }
}
