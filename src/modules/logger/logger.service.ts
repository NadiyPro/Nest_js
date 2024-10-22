import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { Config, SentryConfig } from '../../configs/config.type';

@Injectable()
export class LoggerService {
  private readonly isLocal: boolean;
  //  визначає, чи працює додаток у локальному середовищі.
  //  Це важливо для того, щоб знати, чи варто використовувати локальний логер або Sentry.
  private readonly logger = new Logger();
  // вбудований логер NestJS, який використовується
  // в локальному режимі для виведення повідомлень у консоль

  constructor(private readonly configService: ConfigService<Config>) {
    const sentryConfig = this.configService.get<SentryConfig>('sentry');
    // через ConfigService (файлу configuration.ts по ключу 'sentry'),
    //  який отримує конфігурацію з .env для Sentry
    this.isLocal = sentryConfig.env === 'local';
    // визначає, чи працює середовище як локальне, щоб вирішити,
    // який тип логування використовувати (локальний або через Sentry)

    Sentry.init({
      dsn: sentryConfig.dsn,
      // посилання (https://... записано в env),
      // використовується для підключення до проекту в Sentry
      integrations: [nodeProfilingIntegration()],
      // Tracing інтеграція для профілювання Node.js додатків
      tracesSampleRate: 1.0,
      //  встановлення частоти збору трасувальних та
      //  профілювальних даних для Sentry (100% у цьому випадку)
      debug: sentryConfig.debug,
      // режим налагодження для Sentry, який може бути активованим у конфігурації
      profilesSampleRate: 1.0,
    }); //  ініціалізація (підключення) до Sentry,
    // системи для збору помилок і профілювання.
  }

  public log(message: string): void {
    if (this.isLocal) {
      this.logger.log(message);
      // Якщо це локальне середовище, помилка та її стек виводяться в консоль
    } else {
      Sentry.captureMessage(message, 'log');
      // Якщо це продакшн, помилка передається в Sentry
      // для подальшого аналізу і відстеження
    }
  } // Логування повідомлень відбувається через локальний логер
  // у консоль (у локальному середовищі) або через Sentry (у продакшн середовищі).
  // аналогічно працюють інші методи: info(), warn(), error().
  public info(message: string): void {
    if (this.isLocal) {
      this.logger.log(message);
    } else {
      Sentry.captureMessage(message, 'info');
    }
  }
  public warn(message: string): void {
    if (this.isLocal) {
      this.logger.log(message);
    } else {
      Sentry.captureMessage(message, 'warning');
    }
  }
  public error(error: any): void {
    if (this.isLocal) {
      this.logger.error(error, error.stack);
    } else {
      Sentry.captureException(error, { level: 'error' });
    }
  } // Метод error() додатково передає стек виключення
  // для більш детального логування помилок
}
