import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import configuration from './configs/configuration';
import { ArticlesModule } from './modules/articles/articles.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LoggerModule } from './modules/logger/logger.module';
import { PostgresModule } from './modules/postgres/postgres.module';
import { RedisModule } from './modules/redis/redis.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { TagModule } from './modules/tag/tag.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // forRoot() - метод, який налаштовує модуль конфігурації на глобальному рівні
      load: [configuration],
      // функція configuration завантажує конфігураційні параметри,
      // які будуть використовуватися в ConfigService,
      // тобто configuration це типу наш ConfigService
      isGlobal: true,
      // Вказує, що цей модуль доступний глобально в застосунку,
      // тобто його не потрібно додатково імпортувати в інших модулях
    }),
    // ConfigModule — це вбудований модуль, який використовується
    // для керування конфігураційними параметрами додатку.
    // Він дозволяє легко завантажувати та використовувати налаштування з різних джерел.
    // ConfigModule.forRoot() завантажує конфігурацію з функції configuration і робить
    // її доступною через ConfigService в усьому застосунку.
    // наприклад, з файлів .env, з об'єктів конфігурації, або з інших джерел.
    // в нашому прикладі ми доступаємось до змінних розміщених у файлі configuration
    // (тобто, налаштувань різних параметрів, які можуть бути нами використані)
    LoggerModule,
    RepositoryModule,
    PostgresModule,
    RedisModule,

    AuthModule,
    ArticlesModule,
    UsersModule,
    CommentsModule,
    TagModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  //  масив providers використовується для конфігурації глобального фільтрів.
  //  Властивість provide визначає токен (ключ) APP_FILTER,
  //  який буде використовуватися для ідентифікації фільтра,
  //  а властивість useClass вказує клас, який використовується як фільтр (GlobalExceptionFilter).
  // GlobalExceptionFilter - використовується як глобальний фільтр,
  // щоб контролювати та обробляти виключення, що виникають в додатку.
})
export class AppModule {}
// клас AppModule, який позначений як модуль завдяки декоратору @Module.
// Він поєднує контролери і провайдери, які входять до складу програми
//Як працює цей модуль:
// AppController: це контролер, який обробляє HTTP-запити. Контролери містять маршрути (шляхи),
// які відповідають на запити від клієнтів.
// AppService: це провайдер, який містить бізнес-логіку програми.
// Контролер може використовувати цей сервіс для отримання або обробки даних.
// У результаті, AppModule — це основний модуль програми, який об'єднує контролер та сервіс,
// щоб забезпечити основний функціонал вашої NestJS програми.
