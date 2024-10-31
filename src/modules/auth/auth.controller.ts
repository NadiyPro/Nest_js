import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SkipAuth } from './decorators/skip-auth.decorator';
import { SignInReqDto } from './models/dto/req/sign-in.req.dto';
import { SignUpReqDto } from './models/dto/req/sign-up.req.dto';
import { AuthResDto } from './models/dto/res/auth.res.dto';
import { AuthService } from './services/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { IUserData } from './models/interfaces/user-data.interface';
import { TokenPairResDto } from './models/dto/res/token-pair.res.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('sign-up')
  public async signUp(@Body() dto: SignUpReqDto): Promise<AuthResDto> {
    return await this.authService.signUp(dto);
  }
  // singUp - тут логінація вконується (перший вхід з хешуванням паролю)

  @SkipAuth()
  @Post('sign-in')
  public async signIn(@Body() dto: SignInReqDto): Promise<AuthResDto> {
    return await this.authService.signIn(dto);
  }
  // signIn - тут проходить аутентифікація,
  // перевірка чи існує в нас такий юзер з таким то паролем,
  // якщо існує то генеруємо нову пару токенів
  // (повторний вхід, перевірка паролю, ат видача нової пари токенів)

  @ApiBearerAuth()
  @Post('sign-out')
  public async signOut(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.authService.signOut(userData);
  }
  // хочемо переходячи по даному шляху, видалят токени
  // які належать конкретному юзеру userData
  // userData містить в собі userId, deviceId, email

  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(userData);
  }
  // хочемо отримати нову пару токенів accessToken і refreshToken
  // перевіряємо чи в нас є юзер з таким паролем, якщо є генеруємо нові токени
  // видаляємо стару пару токенів
  // зберігаємо accessToken в кеш (Redis)
  // зберігаємо refreshToken в БД
}
// усі шляхи проходять перевірку через JwtAccessGuard,
// який встановлено як глобальний guard через APP_GUARD в auth.module.ts.
// Це означає, що будь-який маршрут у AuthController (і в додатку)
// за замовчуванням перевірятиметься на наявність дійсного access-токена.
//
// В auth.controller.ts навідміну від інших моделей з шляхами (users, article і т.п)
// ми на шляхи 'sign-up' та 'sign-in', встановили кастомний декоратор @SkipAuth()
// (створений за допомогою SetMetadata) завдяки чому
// ми тут можемо пропустити перевірку JwtAccessGuard
//
// Так як ми хочемо, щоб шлях @Post('refresh') проходив перевірку,
// то ми тут вказуємо, що спочаткук запит має пройти перевірку
// в @UseGuards(JwtRefreshGuard) в цілях безпеки і тільки потім вже будуть
// відбуватсь запти прописані в контролері під даним шляхом
// Перевірку в guards ми не ставимо глобально в auth.module.ts,
// а ставимо точково @UseGuards(JwtRefreshGuard),
// оскільки в нас лише одни шлях @Post('refresh')
// буде перевидавати нову пару токенів, тому доцільно ставити точкову перевірку,
// а не глобальну
