import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrTreeService } from './rr-tree.service';
import { RrTreeController } from './rr-tree.controller';
import { RrTree, RrTreeSchema } from 'src/schemas/rr-tree.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RrTree.name, schema: RrTreeSchema }]),
  ],
  controllers: [RrTreeController],
  providers: [RrTreeService],
})
export class RrTreeModule {}
