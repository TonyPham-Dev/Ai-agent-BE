import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '@utils/document-entity-helper';
import { AppConfig } from '@config/app-config.type';
import appConfig from '../../../../../config/app.config';

export type ConnectSocialSchemaDocument = HydratedDocument<ConnectSocialSchemaClass>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class ConnectSocialSchemaClass extends EntityDocumentHelper {
  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  expiresIn: number;

  @Prop({ required: true })
  openId: string;

  @Prop({ required: true })
  refreshExpiresIn: number;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  scope: string;

  @Prop()
  nickName: string;

  @Prop()
  userName: string;

  @Prop()
  avatarUrl: string;
}

export const ConnectSocialSchema = SchemaFactory.createForClass(ConnectSocialSchemaClass);
