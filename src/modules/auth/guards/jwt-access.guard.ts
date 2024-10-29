import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRepository } from '../../repository/services/user.repository';
import { UserMapper } from '../../users/services/user.mapper';
import { SKIP_AUTH } from '../decorators/skip-auth.decorator';
import { TokenType } from '../models/enums/token-type.enum';
import { AuthCacheService } from '../services/auth-cache-service';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    // reflector.getAllAndOverride - перевіряє наявність метаданих SKIP_AUTH,
    // які додані за допомогою декоратора @SkipAuth() над маршрутом або класом
    // (в нашому прикладі над маршрутом), щоб пропускати аутентифікацію для певних маршрутів
    // Використовує context.getHandler() (повертає функцію-обробник (метод)) та
    // context.getClass() (повертає клас в якому знаходиться метод-обробник)
    // для перевірки наявності метаданих SKIP_AUTH на рівні методу або класу.
    // Якщо метадані SKIP_AUTH знайдені на методі,
    // вони мають пріоритет над метаданими на рівні класу.
    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();
    // отримуємо HTTP-запит з контексту
    // через switchToHttp() ми доступаємось до HTTP запиту,
    // а через getRequest() дістаємо об'єкт запиту (request)
    // Об'єкт запиту (request) - це об'єкт,
    // який містить інформацію про вхідний HTTP-запит,
    // таку як заголовки, параметри запиту, тіло запиту (body),
    // параметри маршруту (route params), тощо.
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];
    // дістанемо токен доступу з Authorization, беремо другий елемент масиву,
    // тобто все, що йде після слова "Bearer "
    // split() в JavaScript використовується для розділення рядка на масив,
    // використовуючи певний роздільник
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokenService.verifyToken(
      accessToken,
      TokenType.ACCESS,
    );
    // //  перевіряємо токен, чи був він створений з використанням
    // конкретного секретного ключа і чи не закінчився термін його дії
    if (!payload) {
      throw new UnauthorizedException();
    }
    const isAccessTokenExist = await this.authCacheService.isAccessTokenExist(
      payload.userId,
      payload.deviceId,
      accessToken,
    );
    // Метод isAccessTokenExist використовується в класі JwtAccessGuard
    // для перевірки, чи токен доступу вже існує в кеші
    if (!isAccessTokenExist) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    // шукаємо користувача в БД за userId, отриманим з токена
    if (!user) {
      throw new UnauthorizedException();
    }
    request.res.locals.user = UserMapper.toIUserData(user, payload);
    // UserMapper.toIUserData(user, payload) дані користувача перетворюються на формат,
    // зручний для передачі в наступні етапи обробки запиту
    // зберігає дані користувача, щоб вони були доступні у всьому ланцюжку обробки запиту
    return true;
    // вказує, що перевірка пройдена, і запит можна пропустити до наступного етапу.
  }
}
// Клас JwtAccessGuard є guard-ом для авторизації,
// який перевіряє наявність валідного токена доступу,
// підтверджує його дійсність і наявність у кеші,
// а також підтверджує, що користувач існує в базі даних.
