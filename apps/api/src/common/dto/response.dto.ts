/**
 * 基础响应 DTO
 */
export class BaseResponseDto {
  success!: boolean;
  timestamp!: string;
  path!: string;
}

/**
 * 成功响应 DTO
 */
export class SuccessResponseDto<T> extends BaseResponseDto {
  declare success: true;
  data!: T;
  message?: string;
}

/**
 * 错误信息 DTO
 */
export class ErrorInfoDto {
  code!: string;
  message!: string;
  details?: unknown;
}

/**
 * 错误响应 DTO
 */
export class ErrorResponseDto extends BaseResponseDto {
  declare success: false;
  error!: ErrorInfoDto;
}
