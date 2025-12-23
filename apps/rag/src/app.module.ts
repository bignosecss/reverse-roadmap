import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';
import { VectorStoreService } from './services/vector-store.service';
import { OllamaEmbedModule } from './ollama-embed/ollama-embed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LangchainChatModule,
    OllamaEmbedModule,
  ],
  controllers: [AppController],
  providers: [AppService, VectorStoreService],
})
export class AppModule {}
