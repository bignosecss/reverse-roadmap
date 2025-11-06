import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './common/response.interceptor';
import { json } from 'express';

// 加载环境变量
dotenv.config({ path: '../../.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置全局前缀
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 增加 request body 中 JSON 字符串的大小限制
  app.use(json({ limit: '16MB' }));

  await app.listen(process.env.PORT ?? 3001);
  console.log(
    `🚀 API Server is running on: http://localhost:${process.env.PORT ?? 3001}/api`,
  );
}
void bootstrap();
