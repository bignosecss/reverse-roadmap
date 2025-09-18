import { Module } from '@nestjs/common';
import { RrNodeContentService } from './rr-node-content.service';
import { RrNodeContentController } from './rr-node-content.controller';

@Module({
  controllers: [RrNodeContentController],
  providers: [RrNodeContentService],
})
export class RrNodeContentModule {}
