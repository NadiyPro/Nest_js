import { Global, Module } from '@nestjs/common';

import { LoggerService } from './logger.service';

@Global()
// декоратор, який робить модуль глобальним,
// тобто його не потрібно імпортувати в інших модулях для того,
// щоб використовувати сервіси з нього.
// LoggerService буде доступний у всьому додатк
@Module({
  imports: [],
  providers: [LoggerService],
  // робить сервіс логування (LoggerService)
  // доступним для ін'єкції в будь-який інший клас (контролери, сервіси тощо)
  exports: [LoggerService],
  // дозволяє використовувати LoggerService за межами модуля
  // (у інших модулях, де імпортований цей глобальний модуль)
})
export class LoggerModule {}
