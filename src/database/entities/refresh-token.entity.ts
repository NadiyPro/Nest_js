import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.REFRESH_TOKENS)
export class RefreshTokenEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  refreshToken: string;

  @Column('text')
  deviceId: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.refreshTokens)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
  // TypeORM автоматично створює зовнішній ключ з автоматично створеною назвою поля,
  // якщо не вказано @JoinColumn. Однак, якщо ви хочете точно визначити,
  // як саме буде називатися ця колонка в таблиці, вам потрібно використовувати @JoinColumn.
  // У вашому випадку, ви хочете, щоб колонка називалася user_id,
  // тому ви вказуєте @JoinColumn({ name: 'user_id' })
  // виконуємо зв'язку Багато-до-одного/один-до-багатьох
  // @ManyToOne(() => , () => ) / @OneToMany(() =>, () => ) - оскільки
  // у одного юзера може бути багато токенів @OneToMany,
  // тобто багато токенів можуть належати одному юзеру @ManyToOne
  // в цьому entity ставимо @ManyToOne оскільки
  // багато Many токенів можуть належати одному One юзеру
}
