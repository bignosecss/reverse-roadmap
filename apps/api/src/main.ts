import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置全局前缀
  app.setGlobalPrefix('api');

  // 注册全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 注册全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 启用 CORS（如果需要）
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(
    `🚀 API Server is running on: http://localhost:${process.env.PORT ?? 3001}/api`,
  );
}
void bootstrap();
