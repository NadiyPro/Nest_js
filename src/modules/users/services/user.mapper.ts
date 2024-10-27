import { UserEntity } from '../../../database/entities/user.entity';
import { UserResDto } from '../models/dto/res/user.res.dto';

export class UserMapper {
  public static toResDto(user: UserEntity): UserResDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      image: user.image,
    };
  }
}
// ми розмістили UserMapper тут, а правильніше було розміщувати його в dto/res
// UserMapper може бути викликаний у сервісі,
// він служить виключно для перетворення даних,
// а не для бізнес-логіки, тому його слід розглядати як компонент,
// пов'язаний із DTO
