import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { UAParser } from 'ua-parser-js';

import { RefreshToken } from '@refresh-token/domain/refresh-token';
import { User } from '@users/domain/user';

import { NullableType } from '../utils/types/nullable.type';
import { AuthService } from './auth.service';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmail(confirmEmailDto.hash);
  }

  @ApiCookieAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async delete(@Req() request): Promise<void> {
    return this.service.softDelete(request.user);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  //@UseInterceptors(new CookieSessionInterceptor())
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
    @Req() req,
    @Res({ passthrough: true }) res,
  ) {
    const ua = UAParser(req.headers['user-agent']);
    const refreshTokenPayload: Partial<RefreshToken> = {
      browser: ua.browser.name,
      ip: req.ip,
      os: ua.os.name,
      userAgent: JSON.stringify(ua),
    };
    const cookiePayload = await this.service.validateLogin(
      loginDto,
      refreshTokenPayload,
    );
    const getToken = (name: string): string | null => {
      const cookie = cookiePayload.find((cookie) => cookie.startsWith(`${name}=`));
      return cookie ? cookie.split('=')[1].split(';')[0] : null;
    };
    return {
      authenticationToken: getToken('Authentication'),
      refreshToken: getToken('Refresh'),
    };
  }

  @ApiCookieAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req,
    @Res({ passthrough: true }) response,
  ): Promise<void> {
    const cookie = req.cookies['Refresh'];
    response.setHeader('Set-Cookie', this.service.getCookieForLogOut());
    const refreshCookie = req.cookies['Refresh'];
    if (refreshCookie) {
      await this.service.revokeRefreshToken(cookie);
    }
  }

  @ApiCookieAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public me(@Req() request): Promise<NullableType<User>> {
    return this.service.me(request.user);
  }

  @ApiCookieAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @Req() req,
    @Res({ passthrough: true }) response,
  ): Promise<void> {
    const cookiePayload = await this.service.createAccessTokenFromRefreshToken(
      req.cookies['Refresh'],
    );
    response.setHeader('Set-Cookie', cookiePayload);
  }

  @Post('email/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: AuthRegisterLoginDto,
  ): Promise<NullableType<User>> {
    return this.service.register(createUserDto);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @ApiCookieAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public update(
    @Req() request,
    @Body() userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    return this.service.update(request.user, userDto);
  }
}
