import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RrRootModule } from './rr-root/rr-root.module';
import { RrTreeModule } from './rr-tree/rr-tree.module';
import { RrNodeModule } from './rr-node/rr-node.module';
import { ErrorHandlerService } from './common/error-handler/error-handler.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://pterosaurscannotfly:CrhLYfRwJMScZqCh@cluster0.c48gslh.mongodb.net/reverse-roadmap?retryWrites=true&w=majority&appName=Cluster0',
    ),
    RrRootModule,
    RrTreeModule,
    RrNodeModule,
  ],
  controllers: [AppController],
  providers: [AppService, ErrorHandlerService],
})
export class AppModule {}
