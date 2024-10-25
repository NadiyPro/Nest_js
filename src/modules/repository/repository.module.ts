import { Global, Module } from '@nestjs/common';

import { ArticleRepository } from './services/article.repository';
import { UserRepository } from './services/user.repository';

const repositories = [UserRepository, ArticleRepository];
// містить репозиторії, які використовуються у модулі
// Це робиться для зручності, щоб уникнути дублювання,
// і забезпечує легке управління списком репозиторіїв

@Global()
@Module({
  providers: [...repositories],
  // Список провайдерів, доступних у цьому модулі.
  // У цьому випадку репозиторії UserRepository та ArticleRepository
  // будуть доступні як сервіси для інжектування в інші компоненти
  exports: [...repositories],
  // Список провайдерів, які будуть доступні за межами цього модуля.
  // Оскільки модуль глобальний,
  // ці сервіси зможуть використовуватися в будь-якому іншому модулі
})
export class RepositoryModule {}
// робить RepositoryModule глобальним у застосунку,
// тобто всі сервіси будуть доступні для всіх модулів
// без необхідності повторного імпорту цього модуля
