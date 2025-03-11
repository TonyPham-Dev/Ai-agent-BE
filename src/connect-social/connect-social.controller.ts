import { Controller, Get, HttpCode, HttpStatus, Post, Query, Redirect } from '@nestjs/common';
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
  async handleAuthCallbackGet(@Query('code') code: string) {
    const token = await this.connectSocialService.exchangeCodeForToken(code);
    return { accessToken: token.access_token, user: token };
  }

  @Post('callback')
  @HttpCode(HttpStatus.OK)
  async handleAuthCallbackPost(@Query('code') code: string) {
    const token = await this.connectSocialService.exchangeCodeForToken(code);
    return { accessToken: token.access_token, user: token };
  }
}
