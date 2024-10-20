import * as path from 'node:path';

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import configuration from './src/configs/configuration';

dotenv.config();
// завантажує змінні середовища з файлу .env,
// розташованого в кореневій текі проекту

const config = configuration().database;
//  отримуємо конфігурації (налаштуання для підключення до БД) з configuration.ts

export default new DataSource({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.user,
  password: config.password,
  database: config.name,
  entities: [
    path.join(process.cwd(), 'src', 'database', 'entities', '*.entity.ts'),
  ],
  // Шлях до файлів ентіті
  // Ентіті - описує структуру таблиці в БД, це типу як моделі
  migrations: [
    path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
  ],
  // Шлях до файлів міграцій
  synchronize: false,
});
// аналогічні налаштування, як і в postgres.module.ts
// підключення до бази даних PostgreSQL,
// де динамічно отримуємо конфігурації для БД через configuration.ts,
// тільки тут у нас шлях НЕ до папки dist з компільованим js файлами,
// а напряму до ts файлів
