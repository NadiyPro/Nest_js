import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserMapper } from '../../users/services/user.mapper';
import { SignInReqDto } from '../models/dto/req/sign-in.req.dto';
import { SignUpReqDto } from '../models/dto/req/sign-up.req.dto';
import { AuthResDto } from '../models/dto/res/auth.res.dto';
import { AuthCacheService } from './auth-cache-service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authCacheService: AuthCacheService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async signUp(dto: SignUpReqDto): Promise<AuthResDto> {
    await this.isEmailNotExistOrThrow(dto.email);
    const password = await bcrypt.hash(dto.password, 10);
    // хешуємо пароль
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );
    // create - створює нову сутність(нового юзера та захешований пароль)
    // save - зберігає нову створену сутність в БД

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });
    // генеруємо пару токенів для нового юзера (accessToken та refreshToken)
    await Promise.all([
      this.authCacheService.saveToken(
        tokens.accessToken,
        user.id,
        dto.deviceId,
      ),
      // зберігаємо accessToken для нового юзера в кеш (Redis)
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          deviceId: dto.deviceId,
          refreshToken: tokens.refreshToken,
        }),
      ),
      // зберігаємо refreshToken для нового юзера в БД
      // create - створює нову сутність(нового юзера та захешований пароль)
      // save - зберігає нову створену сутність в БД
    ]);
    // Promise.all іиконує асинхроних запуск, тобто
    // одночасно буде виконуватися запис аксес токенів в кеш і рефреш токена в БД

    return { user: UserMapper.toResDto(user), tokens };
    // мапаємо юзера, потім повертаємо у відповідь інфо по юзеру та пару токенів по ньому
  }

  public async signIn(dto: SignInReqDto): Promise<any> {
    // return await this.authService.create(dto);
  }

  private async isEmailNotExistOrThrow(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new Error('Email already exists');
    }
  }
}
