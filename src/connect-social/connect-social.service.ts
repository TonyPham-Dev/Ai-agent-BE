import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ConnectSocialService {
  constructor(private readonly configService: ConfigService) {}

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
    return `https://www.tiktok.com/auth/authorize?client_key=${clientId}&scope=user.info.basic&redirect_uri=${this.configService.get<string>('TIKTOK_REDIRECT_URI')}&response_type=code`;
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    const apiUrl = {
      facebook: 'https://graph.facebook.com/v12.0/oauth/access_token',
      google: 'https://oauth2.googleapis.com/token',
      tiktok: 'https://open-api.tiktok.com/oauth/access_token/',
    }["tiktok"];
  
    if (!apiUrl) {
      throw new Error(`Unsupported "tiktok": ${"tiktok"}`);
    }
  
    const clientId = this.configService.get<string>(`TIKTOK_CLIENT_ID`);
    const clientSecret = this.configService.get<string>(`TIKTOK_CLIENT_SECRET`);
    const redirectUri = this.configService.get<string>(`TIKTOK_REDIRECT_URI`);
  
    try {
      const response = await axios.post(apiUrl, {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(`Error exchanging code for token witsh tiktok:`, error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code for access token');
    }
  }
  
}
