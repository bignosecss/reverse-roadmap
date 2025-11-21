import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RrRootModule } from './rr-root/rr-root.module';
import { RrNodeModule } from './rr-node/rr-node.module';
import { RrContentModule } from './rr-content/rr-content.module';
import { DataMigrationModule } from './seeds/data-migration.module';
import { ConfigModule } from '@nestjs/config';

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
    DataMigrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
