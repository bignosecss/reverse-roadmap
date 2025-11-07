import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrRootService } from './rr-root.service';
import { RrRootController } from './rr-root.controller';
import { RrRoot, RrRootSchema } from './schemas/rr-root.schema';
import { RrNode, RrNodeSchema } from 'src/schemas/rr-node.schema';
import { RrNodeModule } from 'src/rr-node/rr-node.module';
import { RrRootRepository } from './repositories/rr-root.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RrRoot.name, schema: RrRootSchema },
      { name: RrNode.name, schema: RrNodeSchema },
    ]),
    RrNodeModule,
  ],
  controllers: [RrRootController],
  providers: [RrRootService, RrRootRepository],
})
export class RrRootModule {}
