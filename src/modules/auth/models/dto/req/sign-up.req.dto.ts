import { PickType } from '@nestjs/swagger';

import { BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpReqDto extends PickType(BaseAuthReqDto, [
  'email',
  'password',
  'bio',
  'name',
  'deviceId',
  // deviceId - для того щоб видати пару токенів яка буде належати конкретному дивайсу,
  // наприклад, для планшету будуть одні токени, для ПК інші і т.п
  // це для того щоб мати можливість слідкувати за активністю конкретного дивайсу
]) {}
// PickType() дозволяє "вибрати" тільки конкретні поля з базового класу
// і використовувати їх у новому DTO
// singUp - тут логінація вконується (перший вхід з хешуванням паролю)
