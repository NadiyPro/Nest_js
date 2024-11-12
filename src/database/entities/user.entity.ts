import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserID } from '../../common/types/entity-ids.type';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';
import { FollowEntity } from './follow.entity';
import { LikeEntity } from './like.entity';
import { CreateUpdateModel } from './models/create-update.model';
import { RefreshTokenEntity } from './refresh-token.entity';

@Index(['name'])
@Entity('users') // назва табл в БД
export class UserEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  // Це декоратор, який вказує, що поле id є первинним ключем (PRIMARY KEY)
  // і генерується автоматично у форматі UUID
  // (універсальний унікальний ідентифікатор)
  id: UserID;
  // Поле id буде використовуватися для
  // унікальної ідентифікації кожного запису (користувача).

  @Column('text')
  // Вказує, що це поле буде зберігатися в базі даних як тип text
  name: string;
  // Поле firstName зберігає ім'я користувача

  @Column('text', { unique: true })
  // unique: true - означає, що значення цього поля повинні бути унікальними
  email: string;

  @Column('text', { select: false })
  password: string;
  //  { select: false } означає, що поле password не буде вибиратися
  //  за замовчуванням при виконанні запитів до бази даних.

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('text')
  bio: string;

  @Column('text', { nullable: true })
  image: string;
  // @VirtualColumn({
  //   query: () => 'SELECT CONCAT(firstName, lastName) FROM users WHERE id = id',
  // })
  // fullName: string;
  // @VirtualColumn - це декоратор, який дозволяє створити колонку,
  // що НЕ зберігається в базі даних, але результат якої розраховується під час запиту
  // CONCAT(firstName, lastName) об'єднує два рядки (ім'я та прізвище)  по id = id

  @Column('timestamp', { nullable: true })
  deleted?: Date;
  // реалізуємо "м’яке" видалення (soft delete),
  // тобто коли поле deleted має значення NULL - запис активний,
  // якщо ж воно містить дату, то цей запис вважається видаленим з того часу,
  // це ми прописуємо в emptity через декоратор
  // timestamp вказує на тип даних колонки. Це означає,
  // що вона зберігає дату і час. У більшості баз даних формат timestamp дозволяє
  // записувати як дату, так і точний час (наприклад, 2024-11-05 10:20:45).
  // Це не фізичне видалення, а скоріше позначка, що користувач неактивний або "видалений".
  // Вся інформація про користувача залишається в базі, і її можна легко відновити.
  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];
  // Виконуємо зв'язку Багато-до-одного/один-до-багатьох
  // @ManyToOne(() => , () => ) / @OneToMany(() =>, () => ) - оскільки
  // у одного юзера може бути багато токенів @OneToMany,
  // тобто багато токенів можуть належати одному юзеру @ManyToOne
  // в цьому entity ставимо @OneToMany оскільки
  // у одного юзера One може бути багато Many токенів
  // refreshTokens?: ми ставимо як не обовзяковий,
  // бо ми можемо використовувати даний UserEntity,
  // щоб просто дістати якусь інформацію просто по юзеру,
  // але у цього юзера refreshTokens може і не бути або нам він не треба
  // refreshTokens: ми ставимо, як обовязковий, якщо ми хочемо
  // конкретно витягнути юзерів і всі токени які їм належать (а не просто інфо по юзеру)
  // тобто, коли в нас є необхідність до юзерів підтягувати токени

  @OneToMany(() => ArticleEntity, (entity) => entity.user)
  articles?: ArticleEntity[];
  // оскільки один One юзер може написати багато постів Many

  @OneToMany(() => LikeEntity, (entity) => entity.user)
  likes?: LikeEntity[];

  @OneToMany(() => CommentEntity, (entity) => entity.user)
  comments?: CommentEntity[];
  // від одного юзера може бути багато коментарів

  @OneToMany(() => FollowEntity, (entity) => entity.follower)
  followers?: FollowEntity[];
  // хто підписався (багато хто може підписатися на одного юзера)

  @OneToMany(() => FollowEntity, (entity) => entity.following)
  followings?: FollowEntity[];
  // на кого підписався (на багатьох кого може підписатися один юзер)
}
// @OneToOne(() =>):
// тут ми завдяки  @JoinColumn створюємо колонку, яка буде містити зовнішній ключ foreign key
// вказується завдяки додаваню декоратора @JoinColumn() і він вказується лише в одній табл лише в одній табл
// @ManyToOne(() => , () => ) / @OneToMany(() =>, () => )
//  При цьому типу зв'язку:
// якщо ми НЕ прописуємо @JoinColumn, то TypeORM автоматично створює зовнішній ключ
// та колонку з автоматично створеною назвою в табл @ManyToOne
// якщо ми хочемо самостійно вказати назву колонки в якій буде зберігатися зовнішній ключ
// (вказати назву колонки по якій була зв'язка),
// то потрібно використовувати @JoinColumn({ name: 'вказуємо бажану назву колонки' })
// @ManyToMany(() =>) зовнішні ключі не зберігаються безпосередньо в жодній з двох пов'язаних таблиць.
// Натомість створюється проміжна таблиця (до якої в нас немає доступу),
// яка містить дві колонки для зовнішніх ключів @JoinTable() ( тут ми НЕ використовуємо - @JoinColumn() )
// Тобто завдяки механізму @ManyToOne, @OneToMany @JoinColumn, @ManyToMany -
// ми автоматично СТВОРЮЄМО поле з Foreign Key,
// а Foreign Key завжди посилається на Primary Key (поле з унікальними значеннями),
// відповідно, на яке поле ми поставимо Primary Key з тим полем і будемо робити звязку,
// найчастіше Primary Key ставлять на id
