import { ConnectSocialType } from 'src/connect-social/domain/connect-social';
import { ConnectSocialSchemaClass } from '../entities/connect-social.schema';

export class ConnectSocialMapper {
  static toDomain(raw: ConnectSocialSchemaClass): ConnectSocialType {
    const connectSocial = new ConnectSocialType();
    connectSocial.id = raw._id?.toString() || '';
    connectSocial.accessToken = raw.accessToken || '';
    connectSocial.expiresIn = raw.expiresIn || 0;
    connectSocial.openId = raw.openId || '';
    connectSocial.refreshExpiresIn = raw.refreshExpiresIn || 0;
    connectSocial.refreshToken = raw.refreshToken || '';
    connectSocial.scope = raw.scope || '';
    connectSocial.nickName = raw.nickName || '';
    connectSocial.userName = raw.userName || '';
    connectSocial.avatarUrl = raw.avatarUrl || '';

    return connectSocial;
  }

  static toPersistence(connectSocial: ConnectSocialType): ConnectSocialSchemaClass {
    const connectSocialEntity = new ConnectSocialSchemaClass();
    if (connectSocial.id) {
      connectSocialEntity._id = connectSocial.id;
    }
    connectSocialEntity.accessToken = connectSocial.accessToken;
    connectSocialEntity.expiresIn = connectSocial.expiresIn;
    connectSocialEntity.openId = connectSocial.openId;
    connectSocialEntity.refreshExpiresIn = connectSocial.refreshExpiresIn;
    connectSocialEntity.refreshToken = connectSocial.refreshToken;
    connectSocialEntity.scope = connectSocial.scope;
    connectSocialEntity.nickName = connectSocial.nickName;
    connectSocialEntity.userName = connectSocial.userName;
    connectSocialEntity.avatarUrl = connectSocial.avatarUrl;

    return connectSocialEntity;
  }
}
