import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';
import { OllamaEmbedModule } from './ollama-embed/ollama-embed.module';
import { FileProcessModule } from './file-process/file-process.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LangchainChatModule,
    OllamaEmbedModule,
    FileProcessModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
