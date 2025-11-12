import { NestFactory } from '@nestjs/core';
import { DataMigrationService } from './data-migration.service';
import { DataMigrationModule } from './data-migration.module';

async function runMigration() {
  const app = await NestFactory.create(DataMigrationModule);
  const migrationService = app.get(DataMigrationService);

  try {
    console.log('Starting data migration...');
    const result = await migrationService.migrateOldData();
    console.log('Migration completed:', result);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await app.close();
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  runMigration();
}
