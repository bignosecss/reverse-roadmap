import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrNodeService } from './rr-node.service';
import { RrNodeController } from './rr-node.controller';
import { RrNode, RrNodeSchema } from 'src/schemas/rr-node.schema';
import { RrNodeMapper } from './mapper/rr-node.mapper';
import { RrRoot, RrRootSchema } from 'src/schemas/rr-root.schema';
import { RrNodeContentModule } from 'src/rr-node-content/rr-node-content.module';

@Module({
  imports: [
    RrNodeContentModule,
    MongooseModule.forFeature([
      { name: RrNode.name, schema: RrNodeSchema },
      { name: RrRoot.name, schema: RrRootSchema },
    ]),
  ],
  controllers: [RrNodeController],
  providers: [RrNodeService, RrNodeMapper],
})
export class RrNodeModule {}
