import { Controller, Get, HttpCode, Post, Query, Redirect, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConnectSocialService } from './connect-social.service';
import { CreateProfileSocialDto } from './dto/connect-social.dto';

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
  async handleAuthCallbackGet(
    @Query() query: any,
    @Request() req: any
  ) {
    try {
      console.log({query})
      console.log(req.query)
      const token = await this.connectSocialService.exchangeCodeForToken(req.query);
      // return { accessToken: token.access_token, user: token, status: 200 };
      return {
        status: 200
      }
    } catch (error) {
      console.log({error})
      return error
    }
  }

  @Post('callback')
  @HttpCode(200)
  async handleAuthCallbackPost(
    @Query() query: any,
    @Request() req: any
  ) {
    try {
      console.log({query})
      console.log(req.query)
      const token = await this.connectSocialService.exchangeCodeForToken(req.query);
      // return { accessToken: token.access_token, user: token, status: 200 };
      return {
        status: 200
      }
    } catch (error) {
      console.log({error})
      return error
    }
  }
}
