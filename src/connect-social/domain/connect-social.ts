import { ApiProperty } from '@nestjs/swagger';

import { Allow } from 'class-validator';

export class ConnectSocialType {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Allow()
  id: string;

  @Allow()
  accessToken: string;
  
  @Allow()
  expiresIn: number;
  
  @Allow()
  openId: string;
  
  @Allow()
  refreshExpiresIn: number;
  
  @Allow()
  refreshToken: string;
  
  @Allow()
  scope: string;
  
  @Allow()
  nickName: string;
  
  @Allow()
  userName: string;

  @Allow()
  avatarUrl: string;
}
