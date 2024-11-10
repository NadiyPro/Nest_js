import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ApiFile } from '../../common/decorators/api-file.decorator';
import { UserID } from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
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
    const result = await this.usersService.findMe(userData);
    return UserMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: UpdateUserReqDto,
  ) {
    const result = await this.usersService.updateMe(userData, updateUserDto);
    return UserMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @Delete('me')
  public async removeMe(@CurrentUser() userData: IUserData) {
    return await this.usersService.removeMe(userData);
  }
  // CurrentUser отримує дані поточного користувача з locals у request
  // Декоратор CurrentUser дістає збережену інформацію про користувача
  // (наприклад, його ID та інші поля) і передає ці дані у змінну userData

  @ApiBearerAuth()
  // вказує, що для цього маршруту потрібна аутентифікація через Bearer-токен
  @ApiConsumes('multipart/form-data')
  // зазначає, що цей маршрут очікує дані у форматі multipart/form-data,
  // який використовується для передачі файлів
  @UseInterceptors(FileInterceptor('avatar'))
  // підключає інтерсептор FileInterceptor для обробки файлу,
  // який надходить із полем avatar із swagger
  // FileInterceptor (з бібліотеки @nestjs/platform-express) зчитує файл з запиту
  // (які у файлу fieldname (у нас — avatar), mimetype, buffer, size та ін)
  // і додає його всі дані (властивості) file у функцію, і вже з uploadAvatar
  // ми передаємо в usersService, де перевіряємо в fileStorageService та
  // зберігаємо оновлені дані по юзеру в БД з аватаром
  @ApiFile('avatar', false, true)
  // @ApiFile - це наш кастомний декоратор ,
  // який налаштовує відображення форми у Swagger
  // де можна завантажити файли в поле (з назвою 'avatar')
  // avatar - ключ (назва поля в яке ми будем завантажувати файл)
  // false - передаємо інфо на обробку, що це не масив
  // true - вказуємо що ключ є обовязковим
  @Post('me/avatar')
  public async uploadAvatar(
    @CurrentUser() userData: IUserData,
    // витягаємо інфо про поточного користувача від якого робиться запит
    @UploadedFile() file: Express.Multer.File,
    // вказує, що файл передається як параметр file у метод.
    // Тип Express.Multer.File вказує, що це файл,
    // оброблений за допомогою Multer
  ): Promise<void> {
    await this.usersService.uploadAvatar(userData, file);
  } // завантажуємо аватар для поточного користувача (згідно наших .enw на MinIO),
  // з використанням інтерсептора для обробки файлу, що надійшов

  @ApiBearerAuth()
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.usersService.deleteAvatar(userData);
  } // видаляємо аватар

  @SkipAuth()
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

  @ApiBearerAuth()
  @Post(':userId/follow')
  public async follow(
    @Param('userId', ParseUUIDPipe) userId: UserID,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.usersService.follow(userData, userId);
  }

  @ApiBearerAuth()
  @Delete(':userId/follow')
  public async unfollow(
    @Param('userId', ParseUUIDPipe) userId: UserID,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.usersService.unfollow(userData, userId);
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
