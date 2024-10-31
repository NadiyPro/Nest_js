import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RefreshTokenEntity } from '../../../database/entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshTokenEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RefreshTokenEntity, dataSource.manager);
  }
  // super() ініціалізує батьківський клас (Repository<RefreshTokenEntity>) з параметрами:
  // RefreshTokenEntity — сутність, з якою працює цей репозиторій.
  // dataSource.manager — це менеджер БД ("помічник") від TypeORM, який знає,
  // як спілкуватися з базою даних, і ми використовуємо його для роботи з RefreshTokenEntity
  // (дозволяє використовувати всі методи create/findAll/findOne/update/remove/delete і т.п)
  public async isRefreshTokenExist(refreshToken: string): Promise<boolean> {
    return await this.existsBy({ refreshToken });
  }
  // existsBy, використовується для перевірки існування запису в БД за
  // певним критерієм (в даному випадку за refreshToken)
  // Метод повертає true, якщо в базі даних знайдено запис із вказаним refreshToken,
  // або false, якщо такого запису немає.
  // Різниця між existsBy та findOne:
  // existsBy перевіряє існування запису без його завантаження, тоді як findOne шукає і повертає сам запис
}
// репозиторій - є "посередником" між нашим кодом і базою даних
