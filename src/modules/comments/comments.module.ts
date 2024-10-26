import { Module } from '@nestjs/common';

import { CommentRepository } from '../repository/services/comment.repository';
import { CommentsController } from './comments.controller';
import { CommentsService } from './services/comments.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository],
  exports: [CommentsService, CommentRepository],
  // ставимо на експорт, оскільки даний сервіс ми використовуємо ще в ArticlesService
})
export class CommentsModule {}
