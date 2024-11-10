import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ArticleID } from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { CreateArticleDto } from './dto/req/create-article.dto';
import { ListArticleQueryDto } from './dto/req/list-article-query.dto';
import { UpdateArticleDto } from './dto/req/update-article.dto';
import { ArticleResDto } from './dto/res/article.res.dto';
import { ArticleListResDto } from './dto/res/article-list.res.dto';
import { ArticlesMapper } from './services/articles.mapper';
import { ArticlesService } from './services/articles.service';

@ApiBearerAuth()
// використовується для позначення того,
// що певні маршрути (ендпоінти) захищені через Bearer-токен авторизацію,
// наприклад, JWT (JSON Web Token)
// (замочки вішаємо на наші ендпоінти, тобто доступ до них буде тільки через токен)
@ApiTags('Articles') // назва групи до якої будуть належать ендпоінти розміщені нижче
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateArticleDto,
  ): Promise<ArticleResDto> {
    const result = await this.articlesService.create(userData, dto);
    return ArticlesMapper.toResDto(result);
  } // створюэмо пост з тегом згідно моделі CreateArticleDto та
  // завдяки декоратору @CurrentUser() витягаємо дані по юзру, що створив цей пост

  @Get()
  public async findAll(
    @CurrentUser() userData: IUserData,
    // витягаємо інфо про поточного користувача від якого робиться запит
    @Query() query: ListArticleQueryDto,
    // дозволяє отримувати параметри запиту з URL, наприклад, ?page=1&limit=10
    // витягаємо дані з запиту (кількість постів, теги, порядок сортування)
  ): Promise<ArticleListResDto> {
    const [entities, total] = await this.articlesService.findAll(
      userData,
      query,
    );
    // entities — список знайдених статей
    // total — загальна кількість статей,
    // що відповідають умовам запиту (використовується для пагінації)
    return ArticlesMapper.toResDtoList(entities, total, query);
    // перетворюємо дані з entities, total та query у структуру ArticleListResDto
  } // отримуємо всі пости зазначеного юзера

  @Get(':articleId')
  public async findOne(
    @CurrentUser() userData: IUserData,
    @Param('articleId') articleId: ArticleID,
  ): Promise<ArticleResDto> {
    const result = await this.articlesService.findOne(userData, articleId);
    return ArticlesMapper.toResDto(result);
  }

  @Patch(':articleId')
  public async update(
    @CurrentUser() userData: IUserData,
    @Param('articleId') articleId: ArticleID,
    @Body() dto: UpdateArticleDto,
  ): Promise<ArticleResDto> {
    const result = await this.articlesService.update(userData, articleId, dto);
    return ArticlesMapper.toResDto(result);
  }
}
