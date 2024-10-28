import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ArticleEntity } from './article.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { UserEntity } from './user.entity';
import { CommentID, UserID } from '../../common/types/entity-ids.type';

@Entity(TableNameEnum.COMMENTS)
export class CommentEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: CommentID;

  @Column('text')
  body: string;

  @Column()
  article_id: string;
  @ManyToOne(() => ArticleEntity, (entity) => entity.comments)
  @JoinColumn({ name: 'article_id' })
  article?: ArticleEntity;
  // багато коментарів може бути у одного поста

  @Column()
  user_id: UserID;
  @ManyToOne(() => UserEntity, (entity) => entity.comments)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
  // багато коментарів може бути від одного юзера
}
