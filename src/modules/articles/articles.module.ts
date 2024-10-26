import { Module } from '@nestjs/common';

import { CommentsModule } from '../comments/comments.module';
import { ArticleRepository } from '../repository/services/article.repository';
import { UsersModule } from '../users/users.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './services/articles.service';

@Module({
  imports: [CommentsModule, UsersModule],
  // затягуємо сюди інформацію, щоб ми могли їх використати в сервісах
  controllers: [ArticlesController, ArticleRepository],
  providers: [ArticlesService, ArticleRepository],
})
export class ArticlesModule {}
