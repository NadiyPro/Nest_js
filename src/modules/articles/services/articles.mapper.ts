import { Injectable } from '@nestjs/common';

import { ArticleEntity } from '../../../database/entities/article.entity';
import { UserMapper } from '../../users/services/user.mapper';
import { ListArticleQueryDto } from '../dto/req/list-article-query.dto';
import { ArticleResDto } from '../dto/res/article.res.dto';
import { ArticleListResDto } from '../dto/res/article-list.res.dto';

@Injectable()
export class ArticlesMapper {
  public static toResDtoList(
    data: ArticleEntity[],
    total: number,
    query: ListArticleQueryDto,
  ): ArticleListResDto {
    return { data: data.map(this.toResDto), total, ...query };
  } // повертаємо масив постів, в форматі this.toResDto,
  // кількість постів, поля query передані в моделі (limit, offset, tag, search)

  public static toResDto(data: ArticleEntity): ArticleResDto {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      body: data.body,
      created: data.created,
      updated: data.updated,
      isLiked: !!data.likes?.length,
      tags: data.tags ? data.tags.map((tag) => tag.name) : [],
      // якщо тегів немає, то поверне порожній масив
      user: data.user ? UserMapper.toResDto(data.user) : null,
      // якщо юзера немає, то поверне null
      // якщо юзер є, то віддаємо статус є підписка на автора посту чи ні
      // isFollowed (true/false)
    };
  }
}
