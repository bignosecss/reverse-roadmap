import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { ApiNodeClient } from './client/api-node.client';

@Module({
  imports: [HttpModule],
  controllers: [AgentController],
  providers: [AgentService, ApiNodeClient],
})
export class AgentModule {}
