import { Body, Controller, Post } from '@nestjs/common';
import { OllamaEmbedService } from './ollama-embed.service';
import { OllamaEmbeddingRequestDto } from './dto/ollama-request.dto';

@Controller('ollama-embed')
export class OllamaEmbedController {
  constructor(private readonly ollamaEmbedService: OllamaEmbedService) {}

  @Post('generate')
  async generateEmbedding(
    @Body() ollamaEmbeddingRequestDto: OllamaEmbeddingRequestDto,
  ) {
    const response = await this.ollamaEmbedService.generateEmbedding(
      ollamaEmbeddingRequestDto,
    );
    return response;
  }
}
