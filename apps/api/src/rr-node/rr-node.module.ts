import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrNodeService } from './rr-node.service';
import { RrNodeController } from './rr-node.controller';
import { ErrorHandlerService } from 'src/common/error-handler/error-handler.service';
import { RrTreeModule } from 'src/rr-tree/rr-tree.module';
import { RrNode, RrNodeSchema } from 'src/schemas/rr-node.schema';

@Module({
  imports: [
    RrTreeModule,
    MongooseModule.forFeature([{ name: RrNode.name, schema: RrNodeSchema }]),
  ],
  controllers: [RrNodeController],
  providers: [RrNodeService, ErrorHandlerService],
})
export class RrNodeModule {}
