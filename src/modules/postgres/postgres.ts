import * as path from 'node:path';
import * as process from 'node:process';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Config, DatabaseConfig } from '../../configs/config.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Config>) => {
        // useFactory - функція, яка виконує логіку для налаштування підключення до БД.
        // Вона отримує ConfigService як залежність і використовує його для отримання налаштувань БД.
        const config = configService.get<DatabaseConfig>('database');
        // конфігурація для TypeORM завантажується з ConfigService,
        // з файлу configuration по ключу 'database'
        return {
          type: 'postgres', // вказуємо доя якої БД будемо конектитись
          host: config.host,
          port: config.port,
          username: config.user,
          password: config.password,
          database: config.name,
          entities: [
            path.join(
              process.cwd(),
              'dist',
              'src',
              'database',
              'entities',
              '*.entity.js',
            ),
          ], // Шлях до файлів ентіт. Ентіті - це типу як моделі, що ми описували (юзери, авто і т.п),
          // кожна модель - це окрема таблиця буде
          // Файли з розширенням .entity.js — це скомпільовані версії класів-ентіті,
          // які використовуються в TypeORM для відображення об'єктів бази даних на класи
          // Node.js не вміє виконувати TypeScript напряму.
          // TypeORM та інші бібліотеки завантажують класи-ентіті та інші файли з папки dist,
          // яка містить уже скомпільовані .js версії файлів.
          // Тому ми вказуємо шлях саме до папки dist в якій містяться скомпільовані файли в форматі js
          migrations: [
            path.join(
              process.cwd(),
              'dist',
              'src',
              'database',
              'migrations',
              '*.js',
            ),
          ], //  Шлях до файлів міграцій у папці dist (щоб виконувати міграції)
          synchronize: false,
          // Якщо встановлено в false,
          // TypeORM не синхронізуватиме схему бази даних автоматично
          // (це рекомендується для продакшн середовища), тобто працюємо завжди з synchronize: false
          migrationsRun: true,
          // Автоматичний запуск міграцій при кожному старті додатка.
        };
      },
      inject: [ConfigService],
      // Вказується масив сервісів, які інжектуються (підкидується) в useFactory.
      // У цьому випадку інжектується ConfigService, який відповідає за надання налаштувань
    }),
  ],
})
export class PostgresModule {}
// підключення до бази даних PostgreSQL у проєкті NestJS за допомогою TypeORM.
// Він налаштовує підключення асинхронно за допомогою TypeOrmModule.forRootAsync,
// де динамічно отримує конфігурацію бази даних через ConfigService (файл configuration.ts),
// використовує її для створення підключення і налаштовує міграції та шляхи до ентіті.
// TypeORM — бібліотека, яка забезпечує ORM-функціональність.
// Вона підтримує різні бази даних, включаючи PostgreSQL,
// і дозволяє вам працювати з базою через об'єктно-орієнтовану модель.
// TypeORM використовує ентіті для відображення даних у таблиці бази даних
// та надає API для операцій з цими даними
