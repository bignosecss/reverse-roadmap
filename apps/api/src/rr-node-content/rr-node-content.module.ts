import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RrNodeContent,
  RrNodeContentSchema,
} from '../schemas/rr-node-content.schema';
import { RrNode, RrNodeSchema } from '../schemas/rr-node.schema';
import { RrNodeContentService } from './rr-node-content.service';
import { RrNodeContentController } from './rr-node-content.controller';
import { RrNodeContentMapper } from './mapper/rr-node-content.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RrNodeContent.name, schema: RrNodeContentSchema },
      { name: RrNode.name, schema: RrNodeSchema },
    ]),
  ],
  controllers: [RrNodeContentController],
  providers: [RrNodeContentService, RrNodeContentMapper],
  exports: [RrNodeContentService, RrNodeContentMapper],
})
export class RrNodeContentModule {}
