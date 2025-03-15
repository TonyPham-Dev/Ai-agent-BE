import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Redirect, Request, Response, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConnectSocialService } from './connect-social.service';
import { CallBackTiktokDto, CheckStatusQrCode } from './dto/connect-social.dto';
import { RolesGuard } from '@roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Social Connect')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
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

  @Get('tiktok/QR')
  async getTiktokAuthQRCode(@Request() req: any,) {
    const url = await this.connectSocialService.getTikTokAuthQRCode(req.user)
    return url;
  }

  // Call spam every 2s to check status qr code
  @Post('tiktok/check-status-QRCode')
  @HttpCode(HttpStatus.OK)
  async getTiktokStatusQrCode(@Request() req: any, @Body() token?: CheckStatusQrCode) {
    const url = await this.connectSocialService.getTikTokStatusQrCode(token, req.user)
    return url;
  }

  @Get('callback')
  @HttpCode(HttpStatus.OK)
  async handleAuthCallbackGet(@Request() req: any, @Query('code') code?: CallBackTiktokDto) {
    const user = await this.connectSocialService.exchangeCodeForToken(code, req.user.id);
    return user;
  }

  @Post('callback')
  @HttpCode(HttpStatus.OK)
  async handleAuthCallbackPost(@Request() req: any, @Query('code') code?: CallBackTiktokDto) {
    const token = await this.connectSocialService.exchangeCodeForToken(code, req.user.id);
    return { accessToken: token.access_token, user: token };
  }
}
