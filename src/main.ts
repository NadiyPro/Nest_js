import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Ця команда створює новий екземпляр додатка на основі AppModule за допомогою NestFactory.
  // Вона ініціалізує всі компоненти програми, налаштовує залежності та маршрутизацію.

  const config = new DocumentBuilder()
    .setTitle('March-2024 NestJS')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth({
      in: 'header',
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: 7,
      persistAuthorization: true,
    },
  });
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
