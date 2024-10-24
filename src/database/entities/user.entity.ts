import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ArticleEntity } from './article.entity';
import { LikeEntity } from './like.entity';
import { CreateUpdateModel } from './models/create-update.model';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity('users') // назва табл в БД
export class UserEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  // Це декоратор, який вказує, що поле id є первинним ключем (PRIMARY KEY)
  // і генерується автоматично у форматі UUID
  // (універсальний унікальний ідентифікатор)
  id: string;
  // Поле id буде використовуватися для
  // унікальної ідентифікації кожного запису (користувача).

  @Column('text')
  // Вказує, що це поле буде зберігатися в базі даних як тип text
  name: string;
  // Поле firstName зберігає ім'я користувача

  @Column('text', { unique: true })
  // unique: true - означає, що значення цього поля повинні бути унікальними
  email: string;

  @Column('text')
  password: string;

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

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];
  // тут entity - це RefreshTokenEntity,
  // а entity.user - це поле user з табл RefreshTokenEntity,
  // яке ми додали при звязці
  // виконуємо зв'язку Багато-до-одного/один-до-багатьох
  // @ManyToOne(() => , () => ) / @OneToMany(() =>, () => ) - оскільки
  // у одного юзера може бути багато токенів @OneToMany,
  // тобто багато токенів можуть належати одному юзеру @ManyToOne
  // в цьому entity ставимо @OneToMany оскільки
  // у одного юзера One може бути багато Many токенів
  //  refreshTokens?: ми ставимо як не обовзяковий,
  //  бо ми можемо використовувати даний UserEntity,
  //  щоб просто дістати якусь інформацію просто по юзеру,
  //  але у цього юзера refreshTokens може і не буди
  //  refreshTokens: ми ставимо, як обовязковий, якщо ми хочемо
  //  конкретно витягнути юзерів і всі токени які їм належать (а не просто інфо по юзеру)

  @OneToMany(() => ArticleEntity, (entity) => entity.user)
  articles?: ArticleEntity[];
  // оскільки один юзер може написати багато постів,
  // але написаний юзером пост може належати тільки йому одному

  @OneToMany(() => LikeEntity, (entity) => entity.user)
  likes?: LikeEntity[];
}
