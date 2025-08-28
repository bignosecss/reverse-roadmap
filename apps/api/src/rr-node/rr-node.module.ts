import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrNodeService } from './rr-node.service';
import { RrNodeController } from './rr-node.controller';
import { RrNode, RrNodeSchema } from 'src/schemas/rr-node.schema';
import { RrNodeMapper } from './mapper/rr-node.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RrNode.name, schema: RrNodeSchema }]),
  ],
  controllers: [RrNodeController],
  providers: [RrNodeService, RrNodeMapper],
  exports: [RrNodeService],
})
export class RrNodeModule {}
