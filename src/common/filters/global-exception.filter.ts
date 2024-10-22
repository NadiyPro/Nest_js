import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { LoggerService } from '../../modules/logger/logger.service';

@Catch()
// декоратор, який повідомляє NestJS, що цей клас є фільтром винятків(помилок).
// Цей фільтр перехоплюватиме всі помилки
export class GlobalExceptionFilter implements ExceptionFilter {
  // implements - означає, що клас зобов'язується
  // реалізувати всі методи та властивості, визначені в ExceptionFilter.
  // ExceptionFilter — це вбудований інтерфейс у NestJS,
  // який ви реалізуєте для створення фільтра винятків(помилок).
  constructor(private readonly logger: LoggerService) {}
  // у конструкторі передається сервіс для логування,
  // який використовується для запису інформації про помилки.

  catch(exception: any, host: ArgumentsHost) {
    // метод catch() є частиною реалізації інтерфейсу ExceptionFilter.
    // Він викликається, коли трапляється помилка
    // ArgumentsHost — це вбудований клас, що надає доступ до аргументів,
    // що були передані в метод, який спричинив полмилку,
    // і використовується для роботи з HTTP-запитами або іншими типами викликів
    const ctx = host.switchToHttp();
    // host.switchToHttp() перетворює об'єкт ArgumentsHost на контекст HTTP-запиту,
    // дозволяючи отримати дані про HTTP-запит
    const response = ctx.getResponse<Response>();
    // HTTP-відповідь, яку будемо надсилати клієнту.
    const request = ctx.getRequest<Request>();
    //  HTTP-запит, з якого можна отримати інформацію, наприклад, URL

    let status: number; // змінна, в якій зберігатиметься HTTP-статус помилки
    let messages: string | string[];
    // змінна для повідомлення про помилку або масиву повідомлень

    if (exception instanceof BadRequestException) {
      // instanceof — це оператор у JavaScript та TypeScript,
      // який перевіряє, чи є об'єкт екземпляром певного класу або його нащадка.
      // exception instanceof BadRequestException — це перевірка,
      // чи є об'єкт exception створеним на основі класу BadRequestException або його підкласів.
      status = exception.getStatus();
      messages = (exception as any).response.message;
      //  BadRequestException - означає, що сервер не може обробити запит через
      //  клієнтську помилку (некоректні дані), наприклад, помилки валідації),
      //  отримуємо статус (400) та повідомлення з об'єкта помилки (exception.response.message).
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      messages = exception.message;
      // Якщо помилка є підкласом HttpException (інші HTTP помилки, наприклад, 404 або 403),
      // витягується статус і повідомлення з об'єкта винятку
    } else {
      status = 500;
      messages = 'Internal server error';
      this.logger.error(exception);
    } // вважається, що це непередбачена помилка,
    // і обробляється як внутрішня помилка сервера (500).
    // Логер записує інформацію про помилку у файл logger.service.ts для діагностики.

    this.logger.error(exception);
    //  виклик логера виконується для всіх типів помилок незалежно від їх типу.
    //  Тобто, після того, як відбулося визначення
    //  типу помилки (BadRequestException, HttpException або інша),
    //  інформація про помилку записується в логер (cайт Sentry),
    //  щоб мати повний запис про всі випадки, коли сталася помилка.
    response.status(status).json({
      statusCode: status, // HTTP-статус помилки
      messages: Array.isArray(messages) ? messages : [messages],
      // масив повідомлень. Якщо повідомлення було рядком,
      // його перетворюють у масив для уніфікації
      timestamp: new Date().toISOString(), // поточний час, коли сталася помилка
      // toISOString() — це метод в JavaScript, який перетворює дату в строку.
      // Цей формат виглядає як рік-місяць-деньTгодини:хвилини:секунди.мілісекундиZ
      // і представляє час у всесвітньо координованому часі (UTC).
      // T — роздільник між датою та часом.Z — означає,
      // що час у форматі UTC (часовий пояс на нульовому меридіані).
      path: request.url, //  URL, за яким виникла помилка
    }); //  сервер надсилає клієнту JSON-форматовану відповідь
  }
}
