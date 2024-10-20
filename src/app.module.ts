import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './configs/configuration';
import { ArticlesModule } from './modules/articles/articles.module';
import { CommentsModule } from './modules/comments/comments.module';
import { PostgresModule } from './modules/postgres/postgres.module';
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
    PostgresModule,
    ArticlesModule,
    UsersModule,
    CommentsModule,
  ],
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
