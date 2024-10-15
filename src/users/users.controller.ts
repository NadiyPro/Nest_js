import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiConflictResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

import { CreateUserReqDto } from './dto/req/create-user.req.dto';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // @ApiOkResponse({ description: 'User created successfully' })
  // @ApiForbiddenResponse({ description: 'Forbidden' })
  // @ApiNotFoundResponse({ description: 'User not found' })
  // @ApiConflictResponse({ description: 'Conflict' })
  @Post()
  create(@Body() createUserDto: CreateUserReqDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserReqDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
