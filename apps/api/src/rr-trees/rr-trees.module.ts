import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrTreesService } from './rr-trees.service';
import { RrTreesController } from './rr-trees.controller';
import { RrTrees, RrTreesSchema } from 'src/schemas/rr-trees.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RrTrees.name, schema: RrTreesSchema }]),
  ],
  controllers: [RrTreesController],
  providers: [RrTreesService],
})
export class RrTreesModule {}
