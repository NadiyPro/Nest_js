import * as process from 'node:process';

import { Config } from './config.type';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    host: process.env.APP_HOST,
  }, // Налаштування програми
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  }, // Налаштування бази даних PostgreSQL
  // PostgreSQL: Більш повільна через використання дискових операцій,
  // але підходить для тривалого зберігання і складних аналітичних операцій,
  // підходить для великих корпоративних додатків,
  // CRM-систем, банківських додатків, електронної комерції тощо
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  }, // Налаштування бази даних Redis
  // Redis: Набагато швидша через використання оперативної пам'яті,
  // але підходить для тимчасових даних, кешування,
  // та роботи в реальному часі, підходить для систем реального часу,
  // таких як чати, інформаційні панелі, лічильники відвідувань тощо
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
  }, // Налаштування AWS (accessKey, secretKey)
});
