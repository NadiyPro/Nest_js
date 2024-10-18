import { Module } from '@nestjs/common';

import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './configs/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      // forRoot() - метод, який налаштовує модуль конфігурації на глобальному рівні
      load: [configuration],
      // Функція configuration завантажує конфігураційні налаштування
      isGlobal: true,
      // Вказує, що цей модуль доступний глобально в застосунку,
      // тобто його не потрібно додатково імпортувати в інших модулях
    }),
    // для того, щоб ми могли доступатись до змінних розміщених у файлі configuration
    // (тобто, налаштувань різних параметрів, які можуть бути нами використані)
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
