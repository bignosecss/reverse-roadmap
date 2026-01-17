import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RrRootModule } from './rr-root/rr-root.module';
import { RrNodeModule } from './rr-node/rr-node.module';
import { RrContentModule } from './rr-content/rr-content.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RagExportModule } from './rag-export/rag-export.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),
    RrRootModule,
    RrNodeModule,
    RrContentModule,
    AuthModule,
    RagExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
