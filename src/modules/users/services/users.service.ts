import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserID } from '../../../common/types/entity-ids.type';
import { Config } from '../../../configs/config.type';
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
  ) {}

  public async findMe(userData: IUserData) {
    return `This action returns a #${userData.userId} user`;
  }

  public async updateMe(userData: IUserData, dto: UpdateUserReqDto) {
    return `This action updates a #${userData.userId} user`;
  }

  public async removeMe(userData: IUserData) {
    return `This action removes a #${userData.userId} user`;
  }

  public async findOne(userId: UserID) {
    return `This action returns a #${userId} user`;
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
