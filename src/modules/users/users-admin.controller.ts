import { Controller, Get, Param } from '@nestjs/common';

import { UsersAdminService } from './services/users-admin.service';

@Controller('users-admin')
export class UsersAdminController {
  constructor(private readonly usersService: UsersAdminService) {}

  @Get(':ban')
  ban(@Param('ban') ban: any) {
    return this.usersService.ban(ban);
  }
}
