import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RrRootModule } from './rr-root/rr-root.module';
import { RrTreeModule } from './rr-tree/rr-tree.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://pterosaurscannotfly:CrhLYfRwJMScZqCh@cluster0.c48gslh.mongodb.net/reverse-roadmap?retryWrites=true&w=majority&appName=Cluster0',
    ),
    RrRootModule,
    RrTreeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
