import { Module } from '@nestjs/common';

import { DatabaseConfig } from '@database/config/database-config.type';
import databaseConfig from '@database/config/database.config';

import { FilesModule } from '@files/files.module';
import { ConnectSocialController } from './connect-social.controller';
import { ConnectSocialService } from './connect-social.service';
import { DocumentConnectSocialPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentConnectSocialPersistenceModule
  : DocumentConnectSocialPersistenceModule;
@Module({
    controllers: [ConnectSocialController],
    exports: [ConnectSocialService, infrastructurePersistenceModule],
    imports: [infrastructurePersistenceModule, FilesModule],
    providers: [ConnectSocialService],
})
export class ConnectSocialModule { }
