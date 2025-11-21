import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response.interceptor';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3001;

  // 设置全局前缀
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 增加 request body 中 JSON 字符串的大小限制
  app.use(json({ limit: '16MB' }));

  await app.listen(PORT);
  console.log(`🚀 API Server is running on: http://localhost:${PORT}/api`);
}
void bootstrap();
