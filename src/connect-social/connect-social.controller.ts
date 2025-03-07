import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConnectSocialService } from './connect-social.service';

@ApiTags('Social Connect')
@Controller('connect/social')
export class ConnectSocialController {
  constructor(private readonly connectSocialService: ConnectSocialService) {}

  @Get('facebook')
  async getFacebookAuthUrl() {
    return { url: await this.connectSocialService.getFacebookAuthUrl() };
  }

  @Get('google')
  async getGoogleAuthUrl() {
    return { url: await this.connectSocialService.getGoogleAuthUrl() };
  }

  @Get('tiktok')
  async getTiktokAuthUrl() {
    return { url: await this.connectSocialService.getTikTokAuthUrl() };
  }

  @Get('callback')
  async handleAuthCallback(@Query('code') code: string, @Query('platform') platform: string) {
    const token = await this.connectSocialService.exchangeCodeForToken(platform, code);
    return { accessToken: token.access_token, user: token };
  }
}
