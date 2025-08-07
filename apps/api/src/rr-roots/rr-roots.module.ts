import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrRootsService } from './rr-roots.service';
import { RrRootsController } from './rr-roots.controller';
import { RrRoots, RrRootsSchema } from 'src/schemas/rr-roots.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RrRoots.name, schema: RrRootsSchema }]),
  ],
  controllers: [RrRootsController],
  providers: [RrRootsService],
})
export class RrRootsModule {}
