import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ArticleID, LikeID, UserID } from '../../common/types/entity-ids.type';
import { ArticleEntity } from './article.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.LIKES)
export class LikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: LikeID;

  @CreateDateColumn()
  created: Date;
  // сюди ми додаємо саме CreateDateColumn,а екстендимо клас CreateUpdateModel
  // оскільки ми можемо лише поставити вбо прибрати лайк,а апдейтити ми його не можемо,
  // відповідно нам треба тільки метод CreateDateColumn()

  @Column()
  user_id: UserID;
  // створюємо окремо колонку, оскільки при автоматичному створені TypeORM її НЕ типізує,
  // для того щоб в нас була можливість доступитися до цієї колонки,
  // тобто щоб ми могли її мапнути, нам треба прописати типізацію для колонки,
  // яку ми хочемо щоб автоматим нам створив TypeORM через механізм @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserEntity, (entity) => entity.likes)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
  // багато Many лайків може поставити один One юзер

  @Column()
  article_id: ArticleID;
  @ManyToOne(() => ArticleEntity, (entity) => entity.likes)
  @JoinColumn({ name: 'article_id' })
  article?: ArticleEntity;
  // багато Many лайків може мати один пост One
}
