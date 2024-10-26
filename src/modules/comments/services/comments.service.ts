import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Config } from '../../../configs/config.type';
import { CommentRepository } from '../../repository/services/comment.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private сommentRepository: CommentRepository,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll() {
    return `This action returns all comments`;
  }

  public async deleteAllCommentsForArticle(articleId: string) {
    // Delete all comments for the article
  }
}
