import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ErrorHandlerService {
  /**
   * 处理数据库操作错误
   * @param error - 捕获的错误
   * @param operation - 操作名称
   * @throws 相应的 NestJS 异常
   */
  handleDatabaseError(error: any, operation: string): never {
    // 如果已经是 NestJS 异常，直接抛出
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    // 处理 MongoDB 特定错误
    if (error.name === 'CastError') {
      throw new BadRequestException({
        code: 'INVALID_ID_FORMAT',
        message: '无效的ID格式',
        details: error.message,
      });
    }

    if (error.code === 11000) {
      throw new BadRequestException({
        code: 'DUPLICATE_KEY',
        message: '数据重复',
        details: '该记录已存在',
      });
    }

    // 处理验证错误
    if (error.name === 'ValidationError') {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: '数据验证失败',
        details: error.message,
      });
    }

    // 默认处理为内部服务器错误
    throw new InternalServerErrorException({
      code: operation.toUpperCase(),
      message: '操作失败',
      details: error instanceof Error ? error.message : String(error),
    });
  }

  /**
   * 处理资源未找到的情况
   * @param resourceName - 资源名称
   * @param identifier - 标识符
   * @throws NotFoundException
   */
  throwNotFound(resourceName: string, identifier: string): never {
    throw new NotFoundException({
      code: `${resourceName.toUpperCase()}_NOT_FOUND`,
      message: `未找到指定的${resourceName}`,
      details: `ID "${identifier}" 对应的${resourceName}不存在`,
    });
  }
}
