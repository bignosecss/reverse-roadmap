import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrRootService } from './rr-root.service';
import { RrRootController } from './rr-root.controller';
import { RrRoot, RrRootSchema } from 'src/schemas/rr-root.schema';
import { RrNode, RrNodeSchema } from 'src/schemas/rr-node.schema';
import { RrRootMapper } from './mapper/rr-root.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RrRoot.name, schema: RrRootSchema },
      { name: RrNode.name, schema: RrNodeSchema },
    ]),
  ],
  controllers: [RrRootController],
  providers: [RrRootService, RrRootMapper],
})
export class RrRootModule {}
