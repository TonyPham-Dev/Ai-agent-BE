import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HomeService } from './home.service';
import { Roles } from '@roles/roles.decorator';
import { RoleEnum } from '@roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@roles/roles.guard';

@ApiTags('Home')
@Controller()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class HomeController {
  constructor(private service: HomeService) {}

  @Get()
  appInfo(@Request() req: any) {
    const user = req.user;
    console.log({ user });
    return this.service.appInfo();
  }
}
