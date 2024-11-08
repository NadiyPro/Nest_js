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
    // createQueryBuilder - це метод у TypeORM використовується для побудови складних SQL-запитів
    // createQueryBuilder('article') — Створює запит, де article є псевдонімом таблиці ArticleEntity
    qb.leftJoinAndSelect('article.tags', 'tag');
    // leftJoinAndSelect: Виконує LEFT JOIN між таблицею article та пов’язаною таблицею тегів
    // (які зберігаються у полі tags)
    // AndSelect означає, що вибираються всі поля з пов'язаної таблиці tags.
    // 'article.tags': Це вказує на те, що поле tags знаходиться у таблиці article
    // Це поле зазвичай представляє зв'язок між статтями і тегами.
    // 'tag': Це псевдонім для сутності тегів, який дозволяє звертатися до полів з таблиці tags у запиті.
    // Наприклад, tag.name може посилатися на поле імені тега.
    qb.leftJoinAndSelect('article.user', 'user');
    //  Виконує ліве з'єднання з таблицею користувачів (user),
    //  що дозволяє додати інформацію про автора статті до результатів

    if (query.search) {
      qb.andWhere('CONCAT(article.title, article.description) ILIKE :search');
      // andWhere — це метод, який додає умову AND до SQL-запиту
      // У даному випадку це означає, що ми додаємо умову пошуку до запиту,
      // щоб знайти статті, які відповідають критеріям
      // Виконує пошук по частковому збігу
      // (ILIKE у PostgreSQL — нечутливий до регістру пошук,
      // а :search - це параметр, який буде замінено реальним значенням пізніше у запиті)
      // за умовою, де title або description містить рядок, вказаний у query.search
      // CONCAT - Об’єднує значення полів title і description для кожної статті в один рядок.
      // Це дає можливість шукати значення search у будь-якій частині цих полів
      qb.setParameter('search', `%${query.search}%`);
      // передає значення для параметра :search з використанням шаблону `%${query.search}%`,
      // де % означає «будь-яка кількість символів до або після»
      // щоб знайти всі статті, що містять рядок query.search у назві або описі
    } //  Перевіряє, чи містить об'єкт query параметр search. Якщо так, додає умову пошуку
    if (query.tag) {
      qb.andWhere('tag.name = :tag', { tag: query.tag });
    } // andWhere додає умову фільтрації з оператором AND, що означає,
    // що до запиту додається нова умова: "де ім'я тега (tag.name) дорівнює значенню query.tag"
    // Перевіряє, чи задано параметр tag та фільтрує статті,
    // які мають конкретний тег, використовуючи параметр tag
    qb.take(query.limit);
    // Обмежує кількість результатів за допомогою limit,
    // щоб повертати лише певну кількість статей на сторінку
    // take у TypeORM використовується для встановлення ліміту кількості результатів,
    // які будуть повернені SQL-запитом. Це фактично аналог оператора LIMIT у SQL
    qb.skip(query.offset);
    // Пропускає визначену кількість записів (offset),
    // щоб підтримувати навігацію між сторінками результатів
    // skip у TypeORM використовується для пропуску певної кількості записів у результатах запиту,
    // що відповідає оператору OFFSET у SQL. Це також є важливим елементом для реалізації пагінації,
    // де skip дозволяє визначити, з якого запису починати вибірк

    return await qb.getManyAndCount();
    // повертає результат у вигляді масиву в якому буде міститись масив статей
    // та їх кількість [ArticleEntity[], number]
  }
}
