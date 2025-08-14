import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrTreeService } from './rr-tree.service';
import { RrTreeController } from './rr-tree.controller';
import { RrTree, RrTreeSchema } from 'src/schemas/rr-tree.schema';
import { ErrorHandlerService } from 'src/common/error-handler/error-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RrTree.name, schema: RrTreeSchema }]),
  ],
  controllers: [RrTreeController],
  providers: [RrTreeService, ErrorHandlerService],
  exports: [RrTreeService],
})
export class RrTreeModule {}
