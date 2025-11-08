import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataMigrationService } from './data-migration.service';
import { DataMigrationController } from './data-migration.controller';
import { RrRoot, RrRootSchema } from '../rr-root/schemas/rr-root.schema';
import { RrNode, RrNodeSchema } from '../rr-node/schemas/rr-node.schema';
import {
  RrContent,
  RrContentSchema,
} from '../rr-content/schemas/rr-content.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RrRoot.name, schema: RrRootSchema },
      { name: RrNode.name, schema: RrNodeSchema },
      { name: RrContent.name, schema: RrContentSchema },
    ]),
  ],
  providers: [DataMigrationService],
  controllers: [DataMigrationController],
  exports: [DataMigrationService],
})
export class DataMigrationModule {}
