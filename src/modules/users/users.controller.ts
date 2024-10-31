import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserID } from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { UpdateUserReqDto } from './models/dto/req/update-user.req.dto';
import { UserBaseResDto } from './models/dto/res/user-base.res.dto';
import { UserMapper } from './services/user.mapper';
import { UsersService } from './services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAccessGuard)
  // для того, щоб підключити перевірку через guards
  // (в swagger біля цього шляху буде відображено замочок)
  // @UseGuards() повинен бути розміщенний обовязково біля @ApiBearerAuth()
  @ApiBearerAuth()
  // вказує, що для цього маршруту потрібна Bearer-аутентифікація,
  // додає інформацію до документації Swagger
  @Get('me')
  public async findMe(@CurrentUser() userData: IUserData) {
    return await this.usersService.findMe(userData);
  }

  @ApiBearerAuth()
  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: UpdateUserReqDto,
  ) {
    return await this.usersService.updateMe(userData, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete('me')
  public async removeMe(@CurrentUser() userData: IUserData) {
    return await this.usersService.removeMe(userData);
  }
  // CurrentUser отримує дані поточного користувача з locals у request
  // Декоратор CurrentUser дістає збережену інформацію про користувача
  // (наприклад, його ID та інші поля) і передає ці дані у змінну userData

  @Get(':userId')
  // динамчний шлях має ОБОВЯЗКОВО бути розташованим ніжче ніж статичні шляхи,
  // оскільки якщо ми його розмістимо вгорі, то с-ма буде в ':userId'
  // замість userId підставляти слово "me",
  // бо читання документа відбувається завжди зверху вниз по порядку
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<UserBaseResDto> {
    const result = await this.usersService.findOne(userId);
    return UserMapper.toResDto(result);
  }
}
// типи Pipes в NestJS
// Pipes у NestJS використовуються для обробки, трансформації або
// валідації даних перед тим, як передати їх далі в контролер.
// Ось кілька основних:
// ValidationPipe — перевіряє дані, наприклад, чи відповідають вони певній DTO
// (Data Transfer Object) схемі.
// Його часто використовують із класами,
// які мають валідатори (наприклад, class-validator).
// ParseIntPipe — перетворює значення параметра на ціле число (integer).
// Якщо значення не є числом, повертає помилку.
// ParseBoolPipe — перетворює значення на булеве (boolean).
// Приймає такі значення: 'true', 'false', '1', '0', і перетворює їх у true або false.
// ParseArrayPipe — перетворює параметр у масив,
// підтримує опції для визначення мінімальної або максимальної довжини масиву.
// DefaultValuePipe — встановлює значення за замовчуванням,
// якщо параметр відсутній.
// Custom Pipes — ти можеш створювати власні пайпи,
// які виконуватимуть специфічну логіку обробки або валідації,
// використовуючи інтерфейс PipeTransform.
// ParseUUIDPipe — це пайп (pipe) в NestJS, який перевіряє,
// чи значення параметра відповідає UUID-формату.
// У цьому випадку, коли ти викликаєш @Get(':userId'), ParseUUIDPipe перевіряє,
// що значення userId є валідним UUID.
// Якщо значення не відповідає формату UUID, NestJS автоматично поверне помилку.
