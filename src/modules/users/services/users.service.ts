import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserID } from '../../../common/types/entity-ids.type';
import { Config } from '../../../configs/config.type';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { ArticleRepository } from '../../repository/services/article.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private userRepository: UserRepository,
    private articleRepository: ArticleRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  public async findMe(userData: IUserData): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userData.userId });
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserReqDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    // шукаємо користувача в БД за userId
    this.userRepository.merge(user, dto);
    // метод merge об’єднує нові дані з dto з поточними даними user.
    // Цей процес оновлює поля об’єкта user новими значеннями з dto,
    // змінюючи його стан. Це означає,
    // що user стає зміненим в пам’яті і одразу готовий для збереження.
    // тобто, через використання методу merge в нас мутує стан const user
    // якщо нам треба, щоб стан user залишався тим який він був,
    // тобто не мутував, то merge використовувати НЕ треба
    return await this.userRepository.save(user);
    // Після об’єднання даних оновлений user зберігається в БД за допомогою save
  }

  public async removeMe(userData: IUserData): Promise<void> {
    // userData містить дані користувача, який хоче "видалити" свій обліковий запис
    await this.userRepository.update(
      { id: userData.userId },
      // шукає запис користувача за ідентифікатором userData.userId
      { deleted: new Date() },
      // встановлює поточну дату та час у поле deleted. Це мітка про "видалення",
      // яка позначає, коли обліковий запис був "видалений".
      // Це не фізичне видалення, а скоріше позначка,
      // що користувач неактивний або "видалений".
      // Вся інформація про користувача залишається в базі, і її можна легко відновити.
    );
    await this.refreshTokenRepository.delete({ user_id: userData.userId });
    // видаляє всі токени оновлення (refresh tokens), пов'язані з користувачем
  }

  public async findOne(userId: UserID): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userId });
  }

  public async follow(userData: IUserData, userId: UserID): Promise<void> {
    if (userData.userId === userId) {
      throw new ConflictException('You cannot follow yourself');
    }
    await this.isUserExistOrThrow(userId);

    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: userId,
    });
    if (follow) {
      throw new ConflictException('You already follow this user');
    }
    await this.followRepository.save(
      this.followRepository.create({
        follower_id: userData.userId,
        following_id: userId,
      }),
    );
  }

  public async unfollow(userData: IUserData, userId: UserID): Promise<void> {
    if (userData.userId === userId) {
      throw new ConflictException('You cannot unfollow yourself');
    }
    await this.isUserExistOrThrow(userId);
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: userId,
    });
    if (!follow) {
      throw new ConflictException('You do not follow this user');
    }
    await this.followRepository.delete({
      follower_id: userData.userId,
      following_id: userId,
    });
  }

  private async isUserExistOrThrow(userId: UserID): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new ConflictException('User not found');
    }
  }
}
// public async checkAbilityToEditArticle(userId: UserID, articleId: ArticleID) {
//   // Check if the user has permission to edit the article
//   const article = await this.articleRepository.findOne({
//     where: { id: articleId, user_id: userId },
//   });
//
// для прикладу перевіремо, чи має користувач (userId) дозвіл на
// редагування певного коментаря який знаходиться під articleId
//  через findOne, знаходимо в БД пост,
//  який відповідає articleId та належить користувачу з userId
//
// merge — це зручний метод об'єднати нові дані з існуючими,
// але він змінює стан переданого об’єкта.
// Тому варто застосовувати його лише тоді,
// коли ми не проти змінювати оригінальний об’єкт.
