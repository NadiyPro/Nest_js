import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { Config, JwtConfig } from '../../../configs/config.type';
import { RedisService } from '../../redis/services/redis.service';

@Injectable()
export class AuthCacheService {
  private jwtConfig: JwtConfig;
  // запис над конструктором дозволяє оголосити і
  // типізувати цю властивість заздалегідь,
  // що робить її доступною у всьому класі, включаючи конструктор

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get('jwt');
  } // Зберігає налаштування 'jwt', отримані з configService

  public async saveToken(
    token: string,
    userId: string,
    deviceId: string,
  ): Promise<void> {
    const key = `ACCESS_TOKEN:${userId}:${deviceId}`;
    // Зберігає токен доступу (token) у Redis за допомогою ключа,
    // який базується на ідентифікаторі користувача (userId) і пристрої (deviceId)
    // завдяки ключу ми зможемо швидко шукати потрібні нам записи в Redis,
    // бо чим унікальніші ключі, тим швидше вибірка буде працювати
    await this.redisService.deleteByKey(key);
    // Спочатку видаляє можливі попередні значення цього ключа (deleteByKey)
    await this.redisService.addOneToSet(key, token);
    // Додає новий токен до множини (addOneToSet)
    await this.redisService.expire(key, this.jwtConfig.accessExpiresIn);
    // Встановлює час життя ключа (expire), використовуючи налаштування accessExpiresIn із jwtConfig
  }
}
// завдяки даному сервісу будемо зберігати токени,
// а потім віддавати нашому посереднику RedisService, щоб вони зберігались в Redis (кешувати)
// створений для того, щоб комунікувати з нашим RedisService (помічником між редіс та кодом)
