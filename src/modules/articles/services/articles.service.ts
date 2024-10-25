import { Injectable } from '@nestjs/common';

import { CommentsService } from '../../comments/services/comments.service';
import { ArticleRepository } from '../../repository/services/article.repository';
import { UsersService } from '../../users/services/users.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly userService: UsersService,
    private readonly commentsService: CommentsService,
    private articleRepository: ArticleRepository,
  ) {}

  create(dto: CreateArticleDto) {
    this.userService.checkAbilityToEditArticle('authorId', 'articleId');
    return 'This action adds a new user';
    // при створені посту article, ми хочемо перевіряти user
    // - userService: UsersService
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateArticleDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    this.commentsService.deleteAllCommentsForArticle('articleId');
    return `This action removes a #${id} user`;
  }
  // ми хочемо видаляючи article(пости), видаляти коментарі до нього comments
  // - commentsService: CommentsService
}
