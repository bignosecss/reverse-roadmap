import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RrRootsModule } from './rr-roots/rr-roots.module';
import { RrTreesModule } from './rr-trees/rr-trees.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      // 在集群地址后面可以添加指定的数据库名称
      // 如果不指定数据库名称，默认会使用 test 数据库
      // 这里指定了数据库名称为 reverse-roadmap
      'mongodb+srv://pterosaurscannotfly:CrhLYfRwJMScZqCh@cluster0.c48gslh.mongodb.net/reverse-roadmap?retryWrites=true&w=majority&appName=Cluster0',
    ),
    RrRootsModule,
    RrTreesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
