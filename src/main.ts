import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Ця команда створює новий екземпляр додатка на основі AppModule за допомогою NestFactory.
  // Вона ініціалізує всі компоненти програми, налаштовує залежності та маршрутизацію.

  const config = new DocumentBuilder() //  Створює новий об'єкт для побудови конфігурації Swagger
    .setTitle('March-2024 NestJS') // Встановлює заголовок API документації
    .setDescription('The cats API description') // опис нашого API
    .setVersion('1.0') // версія нашого API
    .addBearerAuth({
      in: 'header', //вказує, що токен буде передаватися в заголовку HTTP-запиту.
      type: 'http', // тип авторизації — HTTP
      scheme: 'bearer', // Схема авторизації — Bearer
      bearerFormat: 'JWT', //  Формат токена — JWT (JSON Web Token).
    }) // Додає налаштування для авторизації типу Bearer, що використовується для JWT токенів
    .build(); // Створює остаточну конфігурацію на основі вказаних параметрів
  const document = SwaggerModule.createDocument(app, config);
  // Генерує документ Swagger (OpenAPI специфікацію)
  // на основі нашого NestJS додатку (app) та створеної конфігурації (config).
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      // Встановлює, як розкривати розділи документації.
      // 'list' означає, що всі розділи будуть показані у вигляді списку і згорнуті за замовчуванням
      defaultModelsExpandDepth: 7,
      // Визначає глибину, до якої будуть розкриватися моделі даних.
      // Число 7 означає, що вкладені моделі будуть розкриті до 7 рівнів.
      persistAuthorization: true,
      // Дозволяє зберігати стан авторизації між перезавантаженнями сторінки.
      // Тобто, якщо ви ввели токен авторизації, він залишиться активним навіть після оновлення сторінки.
    },
  });
  // Налаштовує маршрут /docs, за яким буде доступна ваша Swagger документація
  const port = 3000;
  const host = 'localhost';

  await app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
    console.log(`Swagger is running on http://${host}:${port}/docs`);
  });
}
void bootstrap();
// NestFactory — основного класу для створення додатків у NestJS.
// Він надає методи для створення та налаштування додатка.
// AppModule — основного модуля програми.
// У NestJS кожен додаток організований у модулі,
// які групують пов'язані компоненти (контролери, сервіси тощо).
