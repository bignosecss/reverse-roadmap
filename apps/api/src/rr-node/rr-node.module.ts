import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrNodeService } from './rr-node.service';
import { RrNodeController } from './rr-node.controller';
import { RrRoot, RrRootSchema } from 'src/rr-root/schemas/rr-root.schema';
import { RrNode, RrNodeSchema } from './schemas/rr-node.schema';
import { RrNodeRepository } from './repositories/rr-node.repository';
import { RrContentModule } from 'src/rr-content/rr-content.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RrNode.name, schema: RrNodeSchema },
      { name: RrRoot.name, schema: RrRootSchema },
    ]),
    RrContentModule,
  ],
  controllers: [RrNodeController],
  providers: [RrNodeService, RrNodeRepository],
  exports: [RrNodeService],
})
export class RrNodeModule {}
