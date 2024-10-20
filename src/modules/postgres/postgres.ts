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
        const config = configService.get<DatabaseConfig>('database');
        // конфігурація для TypeORM завантажується з конфігурацій Nest.js,
        // з файлу configuration
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
          ], // шлях
          migrations: [
            path.join(
              process.cwd(),
              'dist',
              'src',
              'database',
              'migrations',
              '*.js',
            ),
          ], // шлях
          synchronize: false,
          // Якщо встановлено в false,
          // TypeORM не синхронізуватиме схему бази даних автоматично (це рекомендується для продакшн середовища
          migrationsRun: true,
          // шлях
        };
      },
      inject: [ConfigService],
      // ммм
    }),
  ],
})
export class PostgresModule {}
// налаштовує підключення до PostgreSQL з використанням асинхронного фабричного методу.
// Він динамічно отримує конфігурацію бази даних через ConfigService,
// використовує її для створення підключення і налаштовує міграції та шляхи до ентіті.
