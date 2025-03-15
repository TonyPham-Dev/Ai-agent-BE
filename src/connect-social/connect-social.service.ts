import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CallBackTiktokDto } from './dto/connect-social.dto';
import * as qs from 'querystring';
import { SCOPE_TIKTOK_API } from 'test/utils/constants';
import { ConnectSocialRepository } from './infrastructure/persistence/document/connect-social.repository';
import { ConnectSocialType } from './domain/connect-social';
@Injectable()
export class ConnectSocialService {
  constructor(private readonly configService: ConfigService, private readonly connectSocialRepository: ConnectSocialRepository) { }

  async getFacebookAuthUrl(): Promise<string> {
    const clientId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    return `https://www.facebook.com/v12.0/dialog/oauth?client_id=${clientId}&redirect_uri=${this.configService.get<string>('FACEBOOK_REDIRECT_URI')}`;
  }

  async getGoogleAuthUrl(): Promise<string> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    return `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${this.configService.get<string>('GOOGLE_REDIRECT_URI')}&response_type=code&scope=email profile`;
  }

  async getTikTokAuthUrl(): Promise<string> {
    const clientId = this.configService.get<string>('TIKTOK_CLIENT_ID');
    const csrfState = Math.random().toString(36).substring(7);
    let url = 'https://www.tiktok.com/v2/auth/authorize';

    url += `?client_key=${clientId}`;
    url += `${SCOPE_TIKTOK_API}`;
    url += '&response_type=code';
    url += `&redirect_uri=${encodeURIComponent(`${this.configService.get<string>('TIKTOK_REDIRECT_URI')}`)}`;
    url += '&state=' + csrfState;
    return url;
  }


  async exchangeCodeForToken(code?: CallBackTiktokDto): Promise<any> {
    const apiUrl = `${this.configService.get<string>('TIKTOK_URL_API')}/oauth/token/`;
    const clientId = this.configService.get<string>('TIKTOK_CLIENT_ID');
    const clientSecret = this.configService.get<string>('TIKTOK_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('TIKTOK_REDIRECT_URI');

    if (!code) {
      throw new Error('Authorization code is required');
    }

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing TikTok OAuth configuration.');
    }
    try {
      const params = new URLSearchParams();
      params.append('client_key', clientId);
      params.append('client_secret', clientSecret);
      params.append('code', String(code));
      params.append('redirect_uri', redirectUri);
      params.append('grant_type', 'authorization_code');

      const response = await axios.post(apiUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const access_token = response.data.access_token
      const infoUser = await this.getInforUser(access_token)
      const userName = await this.getUserName(access_token)

      const existingUser = await this.connectSocialRepository.findOne({ userName: `@${userName}` });

      if (existingUser) {
        return {  
          nickName: existingUser.nickName,
          userName: existingUser.userName,
          avatarUrl: existingUser.avatarUrl
        };
      }
      const userRepository = await this.connectSocialRepository.create({
        accessToken: access_token,
        avatarUrl: infoUser.avatar_url,
        scope: response.data.scope,
        expiresIn: Number(response.data.expires_in),
        refreshToken: response.data.refresh_token,
        refreshExpiresIn: Number(response.data.refresh_expires_in),
        openId: response.data.open_id,
        nickName: infoUser.display_name,
        userName: `@${userName}`
      })
      return {  
        nickName: userRepository.nickName,
        userName: userRepository.userName,
        avatarUrl: userRepository.avatarUrl
      };
    } catch (error) {
      return true
    }
  }

  async getInforUser(token: string) {
    const user = await axios.get(`${this.configService.get<string>('TIKTOK_URL_API')}/user/info/?fields=open_id,union_id,avatar_url,display_name,user_name`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return user.data.data.user
  }


  async getUserName(token: string) {
    const user = await axios.post(`${this.configService.get<string>('TIKTOK_URL_API')}/post/publish/creator_info/query/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': "application/json; charset=UTF-8"
      }
    })
    return user.data.data.creator_username
  }
}
