import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Config, DatabaseConfig } from '../../../configs/config.type';
import { CreateUserReqDto } from '../models/dto/req/create-user.req.dto';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';
import { UserResDto } from '../models/dto/res/user.res.dto';

@Injectable()
export class UsersService {
  constructor(private readonly configService: ConfigService<Config>) {}

  public async create(createUserDto: CreateUserReqDto): Promise<UserResDto> {
    const appConfig = this.configService.get<DatabaseConfig>('database');
    throw new ForbiddenException('sdfg');
    // щоб протестувати роботу фільтрів по відлову помилок
    // викликаємо помилку з назвою ForbiddenException із повідомленням 'sdfg'
    // ForbiddenException - це спеціальний вид виключення(помилки),
    // який використовується в NestJS для відображення помилки "403 Forbidden
    // (користувачеві не дозволено виконувати операцію)
    return {} as UserResDto;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserReqDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  public async checkAbilityToEditArticle(userId: string, articleId: string) {
    // Check if the user has permission to edit the article
  }
}
