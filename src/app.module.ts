import { Module } from '@nestjs/common';

import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ArticlesModule, UsersModule, CommentsModule],
  // У цьому полі визначаються інші модулі, які імпортуються в цей модуль.
  // Оскільки тут імпортів немає, масив порожній
  // controllers: [AppController],
  // Тут вказані контролери, які використовуються в цьому модулі.
  // У даному випадку це AppController.
  // providers: [AppService],
  // // Це поле визначає провайдери (сервіси),
  // // які будуть доступні в модулі. У даному випадку це AppService
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
