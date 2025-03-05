import { HttpStatus, Injectable } from '@nestjs/common';

import bcrypt from 'bcryptjs';

import { ExceptionTitleList } from '@common/constants/exception-title-list.constants';
import { StatusCodesList } from '@common/constants/status-codes-list.constants';
import { CustomHttpException } from '@exception/custom-http.exception';
import { DeepPartial } from '@utils/types/deep-partial.type';
import { EntityCondition } from '@utils/types/entity-condition.type';
import { IPaginationOptions } from '@utils/types/pagination-options';

import { AuthProvidersEnum } from '@auth/auth-providers.enum';
import { FilesService } from '@files/files.service';
import { RoleEnum } from '@roles/roles.enum';
import { StatusEnum } from '@statuses/statuses.enum';

import { NullableType } from '../utils/types/nullable.type';
import { CreateProfileDto } from './dto/connect-social.dto';

@Injectable()
export class ConnectSocialService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<User> {
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createProfileDto,
    };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findOne({
        email: clonedPayload.email,
      });
      if (userObject) {
        throw new CustomHttpException(
          ExceptionTitleList.EmailAlreadyExists,
          HttpStatus.UNPROCESSABLE_ENTITY,
          StatusCodesList.UnprocessableEntity,
        );
      }
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findOne({
        id: clonedPayload.photo.id,
      });
      if (!fileObject) {
        throw new CustomHttpException(
          ExceptionTitleList.ImageNotExists,
          HttpStatus.UNPROCESSABLE_ENTITY,
          StatusCodesList.UnprocessableEntity,
        );
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RoleEnum).includes(
        clonedPayload.role.id,
      );
      if (!roleObject) {
        throw new CustomHttpException(
          ExceptionTitleList.RoleNotExists,
          HttpStatus.UNPROCESSABLE_ENTITY,
          StatusCodesList.UnprocessableEntity,
        );
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusEnum).includes(
        clonedPayload.status.id,
      );
      if (!statusObject) {
        throw new CustomHttpException(
          ExceptionTitleList.StatusNotExists,
          HttpStatus.UNPROCESSABLE_ENTITY,
          StatusCodesList.UnprocessableEntity,
        );
      }
    }

    return this.usersRepository.create(clonedPayload);
  }
}
