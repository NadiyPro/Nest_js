import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { LikeEntity } from './like.entity';
import { CreateUpdateModel } from './models/create-update.model';
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.ARTICLES)
export class ArticleEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  body?: string;

  @OneToMany(() => LikeEntity, (entity) => entity.article)
  likes?: LikeEntity[];
  // один One пост може мати багато Many лайків

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.articles)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
  // багато Many постів може належати одному юзеру One
  // поле по якому робили звязку буде записане в БД
  // під назвою 'user_id' завдяки @JoinColumn({ name: 'user_id' })

  @ManyToMany(() => TagEntity, (entity) => entity.articles)
  tags?: TagEntity[];
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
