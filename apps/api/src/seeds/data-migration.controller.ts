import { Controller, Post, Get } from '@nestjs/common';
import { DataMigrationService } from './data-migration.service';

@Controller('migrate')
export class DataMigrationController {
  constructor(private readonly migrationService: DataMigrationService) {}

  @Post('old-data')
  async migrateOldData() {
    return this.migrationService.migrateFromOldData();
  }

  @Get('status')
  async getMigrationStatus() {
    return {
      message: 'Data migration service is available',
      endpoints: {
        'POST /migrate/old-data': 'Migrate old data to new schema',
        'GET /migrate/status': 'Get migration status',
      },
    };
  }
}
