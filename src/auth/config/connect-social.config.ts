import { registerAs } from '@nestjs/config';

import { IsBoolean, IsString } from 'class-validator';

import validateConfig from '../../utils/validate-config';
import { ConnectSocialType } from './connect-social.type';

class EnvironmentVariablesValidator {
  @IsString()
  FACEBOOK_CLIENT_ID: string;

  @IsString()
  FACEBOOK_CLIENT_SECRET: string;

  @IsString()
  FACEBOOK_REDIRECT_URI: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsBoolean()
  GOOGLE_CLIENT_SECRET: boolean;

  @IsString()     
  GOOGLE_REDIRECT_URI: string;

  @IsString()
  TIKTOK_CLIENT_ID: string;

  @IsString()
  TIKTOK_CLIENT_SECRET: string;

  @IsString()
  TIKTOK_REDIRECT_URI: string;

  @IsString()
  TIKTOK_DEVELOPER_VERIFICATION: string;
}

export default registerAs<ConnectSocialType>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    faceBookClientId: process.env.FACEBOOK_CLIENT_ID,
    faceBookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    faceBookRedirectUri: process.env.FACEBOOK_REDIRECT_URI,
    clientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
    tiktokClientId: process.env.TIKTOK_CLIENT_ID,
    tiktokClientSecret: process.env.TIKTOK_CLIENT_SECRET,
    tiktokRedirectUri: process.env.TIKTOK_REDIRECT_URI,
    tiktokDeveloperVerification: process.env.TIKTOK_DEVELOPER_VERIFICATION
  };
});
