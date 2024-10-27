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
}
// репозиторій - є  "посередником" між нашим кодом і базою даних
