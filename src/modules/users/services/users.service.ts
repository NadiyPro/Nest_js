import { ConflictException, Injectable } from '@nestjs/common';

import { UserID } from '../../../common/types/entity-ids.type';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { ContentType } from '../../file-storage/enums/content-type.enum';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { FollowRepository } from '../../repository/services/follow.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';

@Injectable()
export class UsersService {
  constructor(
    // private readonly configService: ConfigService<Config>,
    private readonly fileStorageService: FileStorageService,
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
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

  public async uploadAvatar(
    userData: IUserData,
    file: Express.Multer.File,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    // шукаємо юзера по id
    const pathToFile = await this.fileStorageService.uploadFile(
      file,
      ContentType.IMAGE,
      userData.userId,
    ); // завантажуємо аватар для юзера під зазначеним id
    if (user.image) {
      await this.fileStorageService.deleteFile(user.image);
    } // якщо у юзера вже є якась картинка (аватор), то ми його видаляємо
    // тобто видаляємо попередню картинку, а замість неї завантажуємо якусь нову
    await this.userRepository.save({ ...user, image: pathToFile });
    // зберігаємо оновлену інформацію по юзеру вже з аватаром у БД табл юзерів
    // тобто, при збережені старий аватар перетирається на новий
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    // шукаємо юзера по id в БД юзерів
    if (user.image) {
      await this.fileStorageService.deleteFile(user.image);
      await this.userRepository.save({ ...user, image: null });
    } // якщо у юзера є аватар, то ми його видаляємо
    // і зберігаємо юзера з імеджом "null"
  }

  public async findOne(userId: UserID): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userId });
  }

  public async follow(userData: IUserData, userId: UserID): Promise<void> {
    if (userData.userId === userId) {
      throw new ConflictException('You cannot follow yourself');
    } // Перевірка на спробу підписатися на самого себе
    // userData.userId (ідентифікатор поточного користувача, що хоче підписатися)
    // не дорівнює userId (ідентифікатор користувача, на якого хочуть підписатися)
    // Якщо значення однакові, викликається помилка ConflictException з повідомленням,
    // оскільки підписка на самого себе не має сенсу
    await this.isUserExistOrThrow(userId);
    // Метод isUserExistOrThrow перевіряє, чи існує користувач з userId у БД
    // Якщо користувач з таким userId не існує, викине помилку ConflictException

    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId, // той хто підписується
      following_id: userId, // на кого підписується
    });
    if (follow) {
      throw new ConflictException('You already follow this user');
    } // Перевірка на повторну підписку
    // Шукаємо запис в БД, де follower_id (ідентифікатор користувача, що хоче підписатися)
    // і following_id (ідентифікатор користувача, на якого хочуть підписатися) вже існують.
    // Якщо запис знайдено, це означає, що підписка вже існує,
    // і кидається помилка ConflictException з повідомленням
    // ConflictException — це стандартний виняток у NestJS, який використовується для
    // позначення ситуацій, де виникає конфлікт із поточним станом ресурсів (HTTP-статус 409 (Conflict))
    await this.followRepository.save(
      this.followRepository.create({
        follower_id: userData.userId, // той хто підписується
        following_id: userId, // той на кого підписується
      }),
    ); // create створює новий об'єкт підписки з полями follower_id та following_id в followRepository
    // потім зберігається в базі даних методом save
  } // follow призначений для того, щоб користувач міг підписатися на іншого користувача,
  // якщо він ще не підписаний

  public async unfollow(userData: IUserData, userId: UserID): Promise<void> {
    if (userData.userId === userId) {
      throw new ConflictException('You cannot unfollow yourself');
    } // Якщо користувач спробує відписатися від самого себе, кидається ConflictException із повідомленням
    await this.isUserExistOrThrow(userId);
    // Метод isUserExistOrThrow перевіряє, чи існує користувач з userId у БД
    // Якщо користувач з таким userId не існує, викине помилку ConflictException
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: userId,
    });
    if (!follow) {
      throw new ConflictException('You do not follow this user');
    } // // шукаємо в followRepository, який відповідає підписці між поточним користувачем (follower_id) і
    // користувачем, від якого потрібно відписатися (following_id).
    // Якщо запису про підписку немає, то кидається ConflictException із повідомленням
    await this.followRepository.delete({
      follower_id: userData.userId,
      following_id: userId,
    }); // Якщо запис знайдено, то метод видаляє його, тим самим припиняючи підписку
  } // метод unfollow дозволяє користувачеві припинити підписку на іншого користувача,
  // якщо підписка існує

  private async isUserExistOrThrow(userId: UserID): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new ConflictException('User not found');
    }
  } // перевіряє, чи існує користувач із зазначеним userId у базі даних.
  // Якщо користувача не знайдено, метод викидає виняток ConflictException із повідомленням
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
