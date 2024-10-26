import { PickType } from '@nestjs/swagger';

import { BaseUserReqDto } from './base-user.req.dto';

export class UpdateUserReqDto extends PickType(BaseUserReqDto, ['name']) {}
// PickType() дозволяє "вибрати" тільки конкретні поля з базового класу
// і використовувати їх у новому DTO
// Усі декоратори валідації та Swagger документації для name також
// будуть застосовані до цього нового класу.
