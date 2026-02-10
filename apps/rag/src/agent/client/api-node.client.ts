import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { AgentRrNodeDto } from '@repo/shared';

/**
 * 保存 reverse roadmap 的请求 DTO
 */
interface SaveReverseRoadmapDto {
  node: AgentRrNodeDto;
}

@Injectable()
export class ApiNodeClient {
  private readonly logger = new Logger(ApiNodeClient.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiUrl = this.configService.get<string>('API_URL');
    if (!apiUrl) {
      throw new Error('API_URL configuration is required for ApiNodeClient');
    }
    this.baseUrl = apiUrl.replace(/\/$/, '');
  }

  /**
   * 保存 reverse roadmap
   * 将 agent 生成的节点树完整发送给 API，由 API 端处理所有逻辑
   */
  async saveReverseRoadmap(dto: SaveReverseRoadmapDto): Promise<{
    success: boolean;
    nodeId?: string;
    childCount?: number;
    message: string;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/rr-node/save-reverse-roadmap`,
          dto,
        ),
      );
      return response.data;
    } catch (err) {
      const errorMessage = this.getErrorMessage(err);
      this.logger.error(`Failed to save reverse roadmap: ${errorMessage}`);
      throw new Error(`Failed to save reverse roadmap: ${errorMessage}`);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Unknown error occurred';
  }
}
