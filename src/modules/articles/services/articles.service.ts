import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { ArticleID } from '../../../common/types/entity-ids.type';
import { ArticleEntity } from '../../../database/entities/article.entity';
import { TagEntity } from '../../../database/entities/tag.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { ArticleRepository } from '../../repository/services/article.repository';
import { TagRepository } from '../../repository/services/tag.repository';
import { CreateArticleDto } from '../dto/req/create-article.dto';
import { ListArticleQueryDto } from '../dto/req/list-article-query.dto';
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
    // метод createTags для створення нових тегів (якщо їх ще немає в БД).
    // сохраняем в табл по тегам tagRepository

    return await this.articleRepository.save(
      this.articleRepository.create({ ...dto, tags, user_id: userData.userId }),
    );
  } // для збереження нового посту в базі, передаючи dto та список тегів,
  // прив'язаних до посту, тобто зберігаємо новий пост
  // з колонкою userId (створеноюю в результаті звязки) та
  // у цьому випадку tags повертається, щоб
  // встановити зв'язок між статтею (article) і тегами (tags),
  // а не для того, щоб зберігати їх як окрему колонку в таблиці articles.
  // Це пояснюється принципом нормалізації даних у реляційних базах даних,
  // де теги зберігаються окремо, і зв'язок між статтями та тегами здійснюється
  // за допомогою проміжної таблиці (багато-до-багатьох зв’язок)
  // тобто в articleRepository

  public async findAll(
    userData: IUserData,
    query: ListArticleQueryDto,
  ): Promise<[ArticleEntity[], number]> {
    return await this.articleRepository.findAll(userData, query);
  } // повертаємо масив в якому буде міститись масив статей та
  // їх кількість [ArticleEntity[], number]

  public async findOne(articleId: ArticleID): Promise<ArticleEntity> {
    return {} as any;
  } // Метод для пошуку однієї статті за її ідентифікатором

  public async update(
    userData: IUserData,
    articleId: ArticleID,
    updateUserDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    return {} as any;
  } // Метод для оновлення посту

  private async createTags(tags: string[]): Promise<TagEntity[]> {
    if (!tags || !tags.length) return [];
    // Якщо tags порожній або не визначений, повертає порожній масив

    const entities = await this.tagRepository.findBy({ name: In(tags) });
    // знаходить всі теги, що вже існують в БД (де значення поля збігається
    // з будь-яким значенням із заданого списку)
    // In — це оператор у TypeORM, який дозволяє фільтрувати дані за декількома
    // значеннями для конкретного поля.
    // По суті, це аналог SQL-оператора IN, який дозволяє знаходити записи,
    // де значення поля збігається з будь-яким значенням із заданого списку.
    // наприклад ми передали тег [1111, 4444], при цьому тег 1111 в БД тегів існує,
    // а 4444 - в БД відстуній
    const existingTags = entities.map((tag) => tag.name);
    // Створює список existingTags з іменами існуючих тегів
    // наприклад, ми витягаємо з масиву [1111, 4444] значення, створюючи список 1111,4444
    const newTags = tags.filter((tag) => !existingTags.includes(tag));
    // беремо теги що ми прописали в запиті, мапимо їх через фільтр,
    // та витягаємо з них теги яких немає в БД в табл тегів
    // фільтрує нові теги (створює новий масив), яких ще немає в базі (newTags).
    // existingTags — це масив, який містить імена всіх тегів, що вже існують у базі даних,
    // а !existingTags - означає логічне заперечення, тобто це нові теги яких немає в БД
    // Метод includes перевіряє, чи міститься певний елемент в масиві,
    // і повертає true, якщо елемент знайдено, або false, якщо його немає
    // наприклад, в нас 4444 - новий тег, його немає в БД,
    // тобто тег 4444 не буде співпадати з жодним з тегів в БД !existingTags.includes(tag)
    const newEntities = await this.tagRepository.save(
      newTags.map((tag) => this.tagRepository.create({ name: tag })),
    ); // Зберігає нові теги у базі через tagRepository.save. (наприклад, 4444)
    return [...entities, ...newEntities];
    // Повертає об'єднаний масив існуючих і нових тегів.
    // наприклад, ми повернемо масив який ми вже записали в БД табл тегів [1111, 4444]
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
