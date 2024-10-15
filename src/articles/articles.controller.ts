import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiBearerAuth()
// використовується для позначення того,
// що певні маршрути (ендпоінти) захищені через Bearer-токен авторизацію,
// наприклад,JWT (JSON Web Token)
// (замочки вішаємо на наші ендпоінти, тобто доступ до них буде тільки через токен)
@ApiTags('Articles') // назва групи до якої будуть належать ендпоінти розміщені нижче
@Controller('articles')
export class ArticlesController {
  constructor(private readonly usersService: ArticlesService) {}

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.usersService.create(dto);
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateArticleDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
