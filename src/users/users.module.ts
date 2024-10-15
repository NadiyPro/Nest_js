import { forwardRef, Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersAdminController } from './users-admin.controller';
import { UsersAdminService } from './users-admin.service';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [forwardRef(() => ArticlesModule)],
  // імпортуємо інший модуль (ArticlesModule) з використанням функції forwardRef.
  // forwardRef дозволяє сказати NestJS: "Ми знаємо, що модулі залежать один від одного,
  // але спочатку підключи один з них, а потім повернись до другого".
  // Це розриває циклічну залежність.
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService, UsersAdminService],
  exports: [UsersService],
  // ставимо на експорт, оскільки даний сервіс ми використовуємо ще в ArticlesService
})
export class UsersModule {}
