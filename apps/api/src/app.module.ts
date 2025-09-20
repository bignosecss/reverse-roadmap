import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RrRootModule } from './rr-root/rr-root.module';
import { RrNodeModule } from './rr-node/rr-node.module';
import { RrNodeContentModule } from './rr-node-content/rr-node-content.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://pterosaurscannotfly:CrhLYfRwJMScZqCh@cluster0.c48gslh.mongodb.net/reverse-roadmap?retryWrites=true&w=majority&appName=Cluster0',
    ),
    RrRootModule,
    RrNodeModule,
    RrNodeContentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
