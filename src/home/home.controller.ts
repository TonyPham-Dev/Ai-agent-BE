import { Controller, Get, Req, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HomeService } from './home.service';
import { Roles } from '@roles/roles.decorator';
import { RoleEnum } from '@roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@roles/roles.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
@ApiTags('Home')
@Controller()
export class HomeController {
  constructor(private readonly configService: ConfigService) {}
  @Get('tiktok-developers-site-verification.txt')
  verifyTikTok(@Res() res: Response) {
    res.type('text/plain').send(this.configService.get<string>('TIKTOK_DEVELOPER_VERIFICATION'));
  }

  @Get()
  isRunServer(@Res() res: Response) {
    res.status(200).json({ message: 'Server is running' });
  }
}
