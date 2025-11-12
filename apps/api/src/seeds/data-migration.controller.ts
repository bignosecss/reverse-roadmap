import { Controller, Post } from '@nestjs/common';
import { DataMigrationService } from './data-migration.service';

@Controller('data-migration')
export class DataMigrationController {
  constructor(private readonly dataMigrationService: DataMigrationService) {}

  @Post('seed')
  seedData() {
    return this.dataMigrationService.seedData();
  }

  @Post('migrate-old-data')
  migrateOldData() {
    return this.dataMigrationService.migrateOldData();
  }
}
