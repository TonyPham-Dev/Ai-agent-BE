import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CallBackTiktokDto } from './dto/connect-social.dto';
import * as qs from 'querystring';
@Injectable()
export class ConnectSocialService {
  constructor(private readonly configService: ConfigService) { }

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
    url += '&scope=user.info.basic';
    url += '&response_type=code';
    url += `&redirect_uri=${encodeURIComponent(`${this.configService.get<string>('TIKTOK_REDIRECT_URI')}`)}`;
    url += '&state=' + csrfState;
    return url;
  }


  async exchangeCodeForToken(code?: CallBackTiktokDto): Promise<any> {
    const apiUrl = 'https://open.tiktokapis.com/v2/oauth/token/';

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

      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token with TikTok:', error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code for access token');
    }
  }
}
