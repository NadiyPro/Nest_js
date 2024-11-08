import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ArticleEntity } from '../../../database/entities/article.entity';
import { ListArticleQueryDto } from '../../articles/dto/req/list-article-query.dto';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';

@Injectable() // позначає як сервіс, який можна інжектити в інші класи
export class ArticleRepository extends Repository<ArticleEntity> {
  // Repository<ArticleEntity> — ArticleRepository успадковується від класу Repository,
  // який дозволяє використовувати всі методи ORM TypeORM для роботи з ArticleEntity
  constructor(private readonly dataSource: DataSource) {
    super(ArticleEntity, dataSource.manager);
  } // super() ініціалізує батьківський клас (Repository<ArticleEntity>) з параметрами:
  // ArticleEntity — сутність, з якою працює цей репозиторій.
  // dataSource.manager — це менеджер БД ("помічник") від TypeORM, який знає,
  // як спілкуватися з базою даних, і ми використовуємо його для роботи з ArticleEntity
  // (дозволяє використовувати всі методи create/findAll/findOne/update/remove/delete і т.п)

  public async findAll(
    userData: IUserData,
    query: ListArticleQueryDto,
  ): Promise<[ArticleEntity[], number]> {
    const qb = this.createQueryBuilder('article');
    // createQueryBuilder
    // createQueryBuilder('article') — Створює запит, де article є псевдонімом таблиці ArticleEntity
    qb.leftJoinAndSelect('article.tags', 'tag');
    //  Виконує ліве з'єднання (LEFT JOIN) з таблицею тегів (tags),
    //  включаючи їх у результат запиту, і присвоює їм псевдонім tag
    qb.leftJoinAndSelect('article.user', 'user');
    //  Виконує ліве з'єднання з таблицею користувачів (user),
    //  що дозволяє додати інформацію про автора статті до результатів

    if (query.search) {
      qb.andWhere('CONCAT(article.title, article.description) ILIKE :search');
      //  Виконує пошук по частковому збігу (ILIKE у PostgreSQL — нечутливий до регістру пошук)
      //  по назві та опису статті. Пошук здійснюється за умовою,
      //  де title або description містить рядок, вказаний у query.search
      qb.setParameter('search', `%${query.search}%`);
      // ередає значення для параметра :search з використанням шаблону %,
      // щоб знайти всі статті, що містять рядок query.search у назві або описі
    } //  Перевіряє, чи містить об'єкт query параметр search. Якщо так, додає умову пошуку
    if (query.tag) {
      qb.andWhere('tag.name = :tag', { tag: query.tag });
    } // Перевіряє, чи задано параметр tag та фільтрує статті,
    // які мають конкретний тег, використовуючи параметр tag
    qb.take(query.limit);
    // Обмежує кількість результатів за допомогою limit,
    // щоб повертати лише певну кількість статей на сторінку
    qb.skip(query.offset);
    // Пропускає визначену кількість записів (offset),
    // щоб підтримувати навігацію між сторінками результатів

    return await qb.getManyAndCount();
    // повертає результат у вигляді масиву в якому буде міститись масив статей
    // та їх кількість [ArticleEntity[], number]
  }
}
