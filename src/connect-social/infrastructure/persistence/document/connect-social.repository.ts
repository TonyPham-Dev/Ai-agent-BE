import { EntityCondition } from '@utils/types/entity-condition.type';
import { NullableType } from '@utils/types/nullable.type';
import { ConnectSocialType } from 'src/connect-social/domain/connect-social';

export abstract class ConnectSocialRepository {
  abstract create(data: Omit<ConnectSocialType, 'id'>): Promise<ConnectSocialType>;

  abstract findOne(
    fields: EntityCondition<ConnectSocialType>,
  ): Promise<NullableType<ConnectSocialType>>;
}
