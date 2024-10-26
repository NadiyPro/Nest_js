import { PickType } from '@nestjs/swagger';

import { UserBaseResDto } from './user-base.res.dto';

export class UserResDto extends PickType(UserBaseResDto, [
  'id',
  'name',
  'email',
  'bio',
  'image',
]) {}
// PickType() дозволяє "вибрати" тільки конкретні поля з базового класу
// і використовувати їх у новому DTO.
//
//OmitType() дозволяє створювати нові DTO на основі існуючих,
// але на відміну від PickType, він виключає (омітить) певні поля з базового класу.
