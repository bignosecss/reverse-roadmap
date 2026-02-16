import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoaderModule } from './loaders/loader.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VectorModule } from './vectors/vector.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoaderModule,
    VectorModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
