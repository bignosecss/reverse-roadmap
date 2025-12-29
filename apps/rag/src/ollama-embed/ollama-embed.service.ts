import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { OllamaEmbeddingRequestDto } from './dto/ollama-request.dto';
import { OllamaEmbeddingResponseDto } from './dto/ollama-response.dto';
import customMessage from 'src/utils/responses/customMessage.response';
import { MESSAGES } from 'src/utils/constants/messages.constants';

@Injectable()
export class OllamaEmbedService {
  private readonly logger = new Logger(OllamaEmbedService.name);
  private readonly ollamaEmbedUrl = OLLAMA_CONFIG.embedUrl;

  async generateEmbedding(
    ollamaEmbeddingRequestDto: OllamaEmbeddingRequestDto,
  ) {
    if (ollamaEmbeddingRequestDto.input.length <= 0) {
      throw new HttpException(
        customMessage(
          HttpStatus.BAD_REQUEST,
          `嵌入的文本或文本列表不能为空, ${HttpStatus.BAD_REQUEST}`,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Format input for logging - handle both string and array cases
      const inputForLog = Array.isArray(ollamaEmbeddingRequestDto.input)
        ? `Array[${ollamaEmbeddingRequestDto.input.length}]`
        : `${ollamaEmbeddingRequestDto.input.substring(0, 50)}...`;

      this.logger.log(
        `调用 Ollama 生成嵌入，模型：${ollamaEmbeddingRequestDto.model}, 文本：${inputForLog}...`,
      );

      const response = await fetch(this.ollamaEmbedUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ollamaEmbeddingRequestDto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `Ollama API 错误: ${response.status} - ${response.statusText}, 响应内容: ${errorText}`,
        );

        throw new HttpException(
          customMessage(
            response.status,
            `Ollama API 错误: ${response.status} - ${response.statusText}`,
          ),
          response.status,
        );
      }

      const data = (await response.json()) as OllamaEmbeddingResponseDto;

      this.logger.log(
        `嵌入生成成功，部分向量数据：${data.embeddings
          .slice(0, 5)
          .map((vec) => `[${vec.length}维向量]`)
          .join(', ')}`,
      );

      return this.successResponse(data);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  private successResponse = (response: OllamaEmbeddingResponseDto) =>
    customMessage(HttpStatus.OK, MESSAGES.SUCCESS, response);

  private exceptionHandling = (e: unknown) => {
    Logger.error(e);
    throw new HttpException(
      customMessage(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MESSAGES.EXTERNAL_SERVER_ERROR,
      ),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };
}

const OLLAMA_CONFIG = {
  embedUrl: 'http://ollama:11434/api/embed',
  embeddingModel: 'nomic-embed-text',
  timeout: 10000,
};
