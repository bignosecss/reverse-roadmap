import { Module } from '@nestjs/common';
import { OllamaEmbedService } from './ollama-embed.service';
import { OllamaEmbedController } from './ollama-embed.controller';

@Module({
  controllers: [OllamaEmbedController],
  providers: [OllamaEmbedService],
})
export class OllamaEmbedModule {}
