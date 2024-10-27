import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '@nestjs/jwt';

import { Config, JwtConfig } from '../../../configs/config.type';
import { IJwtPayload } from '../models/interfaces/jwt-payload.interface';
import { ITokenPair } from '../models/interfaces/token-pair.interface';

@Injectable()
export class TokenService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    // забезпечує функції для створення та перевірки токенів
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = configService.get<JwtConfig>('jwt');
  }
  //  сервіс у NestJS для генерації та перевірки JWT-токенів,
  //  який використовує JwtService для створення токенів і
  //  ConfigService для доступу до конфігураційних параметрів JWT

  public async generateAuthTokens(payload: IJwtPayload): Promise<ITokenPair> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accessSecret,
      // ключ, який використовується для підпису токена доступу
      expiresIn: this.jwtConfig.accessExpiresIn,
      // термін дії токена доступу
    });
    // signAsync створює асинхронно JWT-токен з вказаними даними і налаштуваннями

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });
    return { accessToken, refreshToken };
  } // генеруємо пару токенів accessToken та refreshToken
  // на основі наданого payload (даних, які включаються в токен)

  public async verifyToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
    // перевіряємо токен, чи був він створений з використанням
    // конкретного секретного ключа і чи не закінчився термін його дії
  }
}
