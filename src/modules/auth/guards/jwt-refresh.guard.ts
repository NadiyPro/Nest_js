import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserMapper } from '../../users/services/user.mapper';
import { TokenType } from '../models/enums/token-type.enum';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // дістаємо обєкт запиту (request) - це об'єкт,
    // таку як заголовки, параметри запиту, тіло запиту (body),
    // параметри маршруту (route params), тощо
    // ExecutionContext у NestJS — це об'єкт,
    // який містить контекст виконання запиту і дозволяє отримувати або
    // змінювати дані запиту на рівні Guards, Interceptors, і Filters
    const refreshToken = request.get('Authorization')?.split('Bearer ')[1];
    // дістанемо токен доступу з Authorization, беремо другий елемент масиву,
    // тобто все, що йде після слова "Bearer "
    // split() в JavaScript використовується для розділення рядка на масив,
    // використовуючи певний роздільник
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );
    // перевіряємо токен, чи був він створений з використанням
    // конкретного секретного ключа і чи не закінчився термін його дії
    if (!payload) {
      throw new UnauthorizedException();
    }

    const isRefreshTokenExist =
      await this.refreshTokenRepository.isRefreshTokenExist(refreshToken);
    if (!isRefreshTokenExist) {
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
