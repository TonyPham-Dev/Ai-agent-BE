import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityCondition } from '@utils/types/entity-condition.type';
import { NullableType } from '@utils/types/nullable.type';

import { ConnectSocialMapper } from '../mappers/connect-social.mapper';
import { ConnectSocialRepository } from '../connect-social.repository';
import { ConnectSocialSchemaClass } from '../entities/connect-social.schema';
import { ConnectSocialType } from 'src/connect-social/domain/connect-social';

@Injectable()
export class ConnectSocialDocumentRepository implements ConnectSocialRepository {
  constructor(
    @InjectModel(ConnectSocialSchemaClass.name)
    private connectSocialModel: Model<ConnectSocialSchemaClass>,
  ) {}

  async create(data: Omit<ConnectSocialType, 'id'>): Promise<ConnectSocialType> {
    const createdconnectSocial = new this.connectSocialModel(data);
    const connectSocialObject = await createdconnectSocial.save();
    return ConnectSocialMapper.toDomain(connectSocialObject);
  }

  async findOne(
    fields: EntityCondition<ConnectSocialType>,
  ): Promise<NullableType<ConnectSocialType>> {
    if (fields.id) {
      const connectSocialObject = await this.connectSocialModel.findById(fields.id);
      return connectSocialObject ? ConnectSocialMapper.toDomain(connectSocialObject) : null;
    }

    const connectSocialObject = await this.connectSocialModel.findOne(fields);
    return connectSocialObject ? ConnectSocialMapper.toDomain(connectSocialObject) : null;
  }
}
