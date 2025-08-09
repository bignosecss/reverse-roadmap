import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RrRootsModule } from './rr-roots/rr-roots.module';
import { RrTreesModule } from './rr-trees/rr-trees.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://pterosaurscannotfly:CrhLYfRwJMScZqCh@cluster0.c48gslh.mongodb.net/reverse-roadmap?retryWrites=true&w=majority&appName=Cluster0',
    ),
    RrRootsModule,
    RrTreesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
