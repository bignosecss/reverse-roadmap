import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RrRootModule } from './rr-root/rr-root.module';
import { RrNodeModule } from './rr-node/rr-node.module';
import { RrContentModule } from './rr-content/rr-content.module';
import { ConfigModule } from '@nestjs/config';
import { RagExportModule } from './rag-export/rag-export.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),
    AuthModule,
    RrRootModule,
    RrNodeModule,
    RrContentModule,
    RagExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
