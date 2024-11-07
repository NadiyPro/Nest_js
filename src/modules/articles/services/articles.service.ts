import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { ArticleID } from '../../../common/types/entity-ids.type';
import { ArticleEntity } from '../../../database/entities/article.entity';
import { TagEntity } from '../../../database/entities/tag.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { ArticleRepository } from '../../repository/services/article.repository';
import { TagRepository } from '../../repository/services/tag.repository';
import { CreateArticleDto } from '../dto/req/create-article.dto';
import { UpdateArticleDto } from '../dto/req/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  public async create(
    userData: IUserData, // Дані користувача, який створює статтю
    dto: CreateArticleDto, // Дані для створення статті
  ): Promise<ArticleEntity> {
    const tags = await this.createTags(dto.tags);
    //  метод createTags для створення нових тегів (якщо їх ще немає в БД).
    // сохраняем в табл по тегам tagRepository

    return await this.articleRepository.save(
      this.articleRepository.create({ ...dto, tags, user_id: userData.userId }),
    );
  } // для збереження нового посту в базі, передаючи dto та список тегів,
  // прив'язаних до посту, тобто зберігаємо новий пост з відповідним тегом в табл по постам
  // тобто в articleRepository

  public async findOne(articleId: ArticleID): Promise<ArticleEntity> {
    return {} as any;
  } // Метод для пошуку однієї статті за її ідентифікатором

  public async update(
    userData: IUserData,
    articleId: ArticleID,
    updateUserDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    return {} as any;
  } // Метод для оновлення статт

  private async createTags(tags: string[]): Promise<TagEntity[]> {
    if (!tags || !tags.length) return [];
    // Якщо tags порожній або не визначений, повертає порожній масив

    const entities = await this.tagRepository.findBy({ name: In(tags) });
    //  знаходить всі теги, що вже існують в БД
    // In — це оператор у TypeORM, який дозволяє фільтрувати дані за декількома
    // значеннями для конкретного поля.
    // По суті, це аналог SQL-оператора IN, який дозволяє знаходити записи,
    // де значення поля збігається з будь-яким значенням із заданого списку.
    const existingTags = entities.map((tag) => tag.name);
    // Створює список existingTags з іменами існуючих тегів
    const newTags = tags.filter((tag) => !existingTags.includes(tag));
    // фільтрує нові теги (створює новий масив), яких ще немає в базі (newTags).
    // existingTags — це масив, який містить імена всіх тегів, що вже існують у базі даних,
    // а !existingTags - означає логічне заперечення, тобто це нові теги яких немає в БД
    // Метод includes перевіряє, чи міститься певний елемент в масиві,
    // і повертає true, якщо елемент знайдено, або false, якщо його немає
    const newEntities = await this.tagRepository.save(
      newTags.map((tag) => this.tagRepository.create({ name: tag })),
    ); // Зберігає нові теги у базі через tagRepository.save.
    return [...entities, ...newEntities]; // Повертає об'єднаний масив існуючих і нових тегів.
  } //  створює нові теги, якщо вони ще не існують у БД

  // remove(id: number) {
  //   this.commentsService.deleteAllCommentsForArticle('articleId');
  //   return `This action removes a #${id} user`;
  //   // ми хочемо видаляючи article(пости), видаляти коментарі до нього comments
  //   // - commentsService: CommentsService
  // }
}
// ArticlesService — це сервіс для управління статтями,
// який включає CRUD (створення, читання, оновлення) операції.
// Завдяки декоратору @Injectable(), цей сервіс можна інжектувати в інші класи.
