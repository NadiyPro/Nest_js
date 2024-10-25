import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ArticleEntity } from './article.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';

@Entity(TableNameEnum.TAGS)
export class TagEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @ManyToMany(() => ArticleEntity, (entity) => entity.tags)
  @JoinTable()
  articles?: ArticleEntity[];
  // багато Many постів можуть мати однакові теги,
  // при цьому багато Many тегів можуть відноситися до одного посту
  // виходить відношення багато до багатьох
  // (пости/теги наприклад ті що в інстаграм / фб і т.п)
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
