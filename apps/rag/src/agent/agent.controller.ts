import { Controller, Post, Body } from '@nestjs/common';
import { AgentService } from './agent.service';
import type { AgentQueryRequest } from '@repo/shared';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async agent(@Body() body: AgentQueryRequest) {
    const { query, context } = body;
    return await this.agentService.agent(query, context);
  }
}
