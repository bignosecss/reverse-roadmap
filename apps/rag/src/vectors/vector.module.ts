import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VectorRepository } from './vector.repository';
import { Vector, VectorSchema } from './vector.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vector.name, schema: VectorSchema }]),
  ],
  providers: [VectorRepository],
  exports: [VectorRepository],
})
export class VectorModule {}
