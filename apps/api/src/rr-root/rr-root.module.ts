import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrRootService } from './rr-root.service';
import { RrRootController } from './rr-root.controller';
import { RrRoot, RrRootSchema } from 'src/schemas/rr-root.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RrRoot.name, schema: RrRootSchema }]),
  ],
  controllers: [RrRootController],
  providers: [RrRootService],
})
export class RrRootModule {}
