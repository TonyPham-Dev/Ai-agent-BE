import { Module } from '@nestjs/common';

import { DatabaseConfig } from '@database/config/database-config.type';
import databaseConfig from '@database/config/database.config';

import { FilesModule } from '@files/files.module';
import { ConnectSocialController } from './connect-social.controller';
import { ConnectSocialService } from './connect-social.service';
@Module({
    controllers: [ConnectSocialController],
    exports: [ConnectSocialService],
    imports: [FilesModule],
    providers: [ConnectSocialService],
})
export class ConnectSocialModule { }
