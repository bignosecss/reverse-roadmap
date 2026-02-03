import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmbeddingModule } from './embeddings/embedding.module';
import { LoaderModule } from './loaders/loader.module';
import { VectorModule } from './vectors/vector.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),
    EmbeddingModule,
    VectorModule,
    LoaderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
