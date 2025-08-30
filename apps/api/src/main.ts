import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './response/response.interceptor';

// 加载环境变量
dotenv.config({ path: '../../.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置全局前缀
  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3001);
  console.log(
    `🚀 API Server is running on: http://localhost:${process.env.PORT ?? 3001}/api`,
  );
}
void bootstrap();
