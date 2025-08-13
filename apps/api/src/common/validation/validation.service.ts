import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidationService {
  /**
   * 验证并转换 ObjectId
   * @param id - 字符串格式的ID
   * @param fieldName - 字段名称，用于错误消息
   * @returns Types.ObjectId - 转换后的 ObjectId
   * @throws BadRequestException - 当ID格式无效时
   */
  validateObjectId(id: string, fieldName: string = 'ID'): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException({
        code: 'INVALID_OBJECT_ID',
        message: `无效的 ${fieldName} 格式`,
        details: `提供的 ${fieldName} "${id}" 不是有效的 MongoDB ObjectId`,
      });
    }
    return new Types.ObjectId(id);
  }

  /**
   * 验证必填字符串字段
   * @param value - 要验证的值
   * @param fieldName - 字段名称
   * @param minLength - 最小长度（可选）
   * @throws BadRequestException - 当验证失败时
   */
  validateRequiredString(
    value: string,
    fieldName: string,
    minLength?: number,
  ): void {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException({
        code: 'INVALID_FIELD',
        message: `${fieldName} 不能为空`,
        details: `${fieldName} 必须是非空字符串`,
      });
    }

    if (minLength && value.trim().length < minLength) {
      throw new BadRequestException({
        code: 'FIELD_TOO_SHORT',
        message: `${fieldName} 长度不足`,
        details: `${fieldName} 至少需要 ${minLength} 个字符`,
      });
    }
  }
}
