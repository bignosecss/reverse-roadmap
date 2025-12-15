import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3002;

  app.setGlobalPrefix('rag/v1');
  app.enableCors();
  await app.listen(PORT);
  console.log(`🚀 RAG Server is running  on : http://localhost:${PORT}/rag/v1`);
}
void bootstrap();
