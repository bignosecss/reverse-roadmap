import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response.interceptor';
import { json } from 'express';
import session from 'express-session';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3001;

  // 设置全局前缀
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 增加 request body 中 JSON 字符串的大小限制
  app.use(json({ limit: '16MB' }));
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      rolling: true, // 每次请求重置过期时间
      cookie: {
        httpOnly: true,
        sameSite: true,
        maxAge: 30 * 60 * 1000, // 30 分钟不活跃后过期
        // secure: true, // 开发环境设置 false
      },
    }),
  );
  app.useGlobalGuards(new AuthGuard());

  await app.listen(PORT);
  console.log(`🚀 API Server is running on: http://localhost:${PORT}/api`);
}
void bootstrap();
