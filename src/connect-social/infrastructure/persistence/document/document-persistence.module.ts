import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConnectSocialSchema, ConnectSocialSchemaClass } from './entities/connect-social.schema';
import { ConnectSocialDocumentRepository } from './repositories/connect-social.repository';
import { ConnectSocialRepository } from './connect-social.repository';

@Module({
  exports: [ConnectSocialRepository],
  imports: [
    MongooseModule.forFeature([
      { name: ConnectSocialSchemaClass.name, schema: ConnectSocialSchema },
    ]),
  ],
  providers: [
    {
      provide: ConnectSocialRepository,
      useClass: ConnectSocialDocumentRepository,
    },
  ],
})
export class DocumentConnectSocialPersistenceModule {}
