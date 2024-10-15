import { Module } from '@nestjs/common';

import { CommentsModule } from '../comments/comments.module';
import { UsersModule } from '../users/users.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
  imports: [CommentsModule, UsersModule],
  // затягуємо сюди інформацію, щоб ми могли їх використати в сервісах
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
