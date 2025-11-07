import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RrContentService } from './rr-content.service';
import { RrContentController } from './rr-content.controller';
import { RrContent, RrContentSchema } from './schemas/rr-content.schema';
import { RrContentRepository } from './repositories/rr-content.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RrContent.name, schema: RrContentSchema },
    ]),
  ],
  controllers: [RrContentController],
  providers: [RrContentService, RrContentRepository],
  exports: [RrContentService],
})
export class RrContentModule {}
