import { Module } from '@nestjs/common';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
  // ставимо на експорт, оскільки даний сервіс ми використовуємо ще в ArticlesService
})
export class CommentsModule {}
