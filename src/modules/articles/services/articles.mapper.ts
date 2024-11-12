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
      // ?.length — використовується для безпечного доступу до довжини масиву likes
      // Якщо likes відсутній, вираз поверне undefined або null
      // Отже, якщо у пості є хоча б один лайк (data.likes?.length більше нуля),
      // то isLiked буде true в іншому випадку false
      // !! — це подвійне заперечення, яке перетворює значення на булеве (true або false).
      // Тобто, якщо data.likes?.length має значення більше нуля, це перетвориться на true.
      // Якщо ж data.likes відсутній або масив порожній, результат буде false.
      tags: data.tags ? data.tags.map((tag) => tag.name) : [],
      // якщо тегів немає, то поверне порожній масив
      user: data.user ? UserMapper.toResDto(data.user) : null,
      // якщо юзера немає, то поверне null
      // якщо юзер є, то віддаємо статус є підписка на автора посту чи ні
      // isFollowed (true/false)
    };
  }
}
