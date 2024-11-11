import { UserEntity } from '../../../database/entities/user.entity';
import { IJwtPayload } from '../../auth/models/interfaces/jwt-payload.interface';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { UserResDto } from '../models/dto/res/user.res.dto';

export class UserMapper {
  public static toResDto(user: UserEntity): UserResDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      image: `${user.image}`,
      // Це рядок для формування URL до зображення користувача
      // ${process.env.AWS_S3_ENDPOINT} бере значення з .env
      // ${user.image} додає шлях до файлу зображення конкретного користувача
      isFollowed: user.followings?.length > 0 || false,
      // якщо користувач має підписників, то повертаємо true,
      // якщо користувач не має підписників повертаємо false
      // (Це дозволяє уникнути помилок, якщо followings не визначений,
      // повертаючи false за замовчуванням)
    };
  }

  public static toIUserData(
    user: UserEntity,
    jwtPayload: IJwtPayload,
  ): IUserData {
    return {
      userId: user.id,
      deviceId: jwtPayload.deviceId,
      email: user.email,
    };
  }
}
// ми розмістили UserMapper тут, а правильніше було розміщувати його в dto/res
// UserMapper може бути викликаний у сервісі,
// він служить виключно для перетворення даних,
// а не для бізнес-логіки, тому його слід розглядати як компонент,
// пов'язаний із DTO
