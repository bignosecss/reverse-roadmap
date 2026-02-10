import { IsObject } from 'class-validator';
import type { AgentRrNodeDto } from '@repo/shared';

/**
 * 保存 reverse roadmap 的请求 DTO
 */
export class SaveReverseRoadmapDto {
  @IsObject()
  node!: AgentRrNodeDto;
}

/**
 * 保存 reverse roadmap 的响应 DTO
 */
export interface SaveReverseRoadmapResponse {
  success: boolean;
  message: string;
  nodeId?: string;
  childCount?: number;
}
