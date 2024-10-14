import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Ця команда створює новий екземпляр додатка на основі AppModule за допомогою NestFactory.
  // Вона ініціалізує всі компоненти програми, налаштовує залежності та маршрутизацію.
  await app.listen(3000);
  // Після створення додатка він починає слухати на порту 3000.
  // Це означає, що HTTP-сервер буде готовий приймати вхідні запити на цьому порту.
}
void bootstrap();
// NestFactory — основного класу для створення додатків у NestJS.
// Він надає методи для створення та налаштування додатка.
// AppModule — основного модуля програми.
// У NestJS кожен додаток організований у модулі,
// які групують пов'язані компоненти (контролери, сервіси тощо).
