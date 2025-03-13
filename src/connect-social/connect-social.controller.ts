import { Controller, Get, HttpCode, HttpStatus, Post, Query, Redirect, Request, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConnectSocialService } from './connect-social.service';
import { CallBackTiktokDto } from './dto/connect-social.dto';

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
    const url = await this.connectSocialService.getTikTokAuthUrl()
    return url;
  }

  @Get('callback')
  async handleAuthCallbackGet(@Request() req: any, @Query('code') code?: CallBackTiktokDto) {
    const user = await this.connectSocialService.exchangeCodeForToken(code);
    return user;
  }

  @Post('callback')
  @HttpCode(HttpStatus.OK)
  async handleAuthCallbackPost(@Request() req: any, @Query('code') code?: CallBackTiktokDto) {
    const token = await this.connectSocialService.exchangeCodeForToken(code);
    return { accessToken: token.access_token, user: token };
  }
}
