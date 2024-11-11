import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ArticleID } from '../../../common/types/entity-ids.type';
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
  // DataSource - це клас, через який TypeORM виконує запити до бази,
  // керує транзакціями та забезпечує доступ до Repository і EntityManager.
  // dataSource.manager — це менеджер БД ("помічник") від TypeORM, який знає,
  // як спілкуватися з базою даних, і ми використовуємо його для роботи з ArticleEntity
  // (дозволяє використовувати всі методи create/findAll/findOne/update/remove/delete і т.п)

  public async findAll(
    userData: IUserData,
    query: ListArticleQueryDto,
  ): Promise<[ArticleEntity[], number]> {
    const qb = this.createQueryBuilder('article');
    // createQueryBuilder - це метод у TypeORM використовується для побудови складних SQL-запитів
    // createQueryBuilder на основі ArticleRepository, який успадковує Repository<ArticleEntity>,
    // TypeORM розуміє, що цей QueryBuilder прив’язаний до сутності ArticleEntity, тобто
    // createQueryBuilder('article') — створює запит, де article є псевдонімом таблиці ArticleEntity
    qb.leftJoinAndSelect('article.tags', 'tag');
    // leftJoinAndSelect: Виконує LEFT JOIN між таблицею article та пов’язаною таблицею тегів
    // AndSelect означає, що вибираються та повертатимо всі поля з пов'язаної таблиці tags.
    // 'article.tags': Це вказує на те, що поле tags знаходиться у таблиці article
    // Це поле зазвичай представляє зв'язок між статтями і тегами.
    // 'tag': Це псевдонім для сутності тегів, який дозволяє звертатися до полів з таблиці tags у запиті.
    // Наприклад, tag.name може посилатися на поле імені тега.
    // 'tag' в контексті qb.leftJoinAndSelect('article.tags', 'tag') виглядатиме так,
    // як основна таблиця tags, але зі всіма тегами, які пов’язані з
    // конкретною статтею через проміжну таблицю article_tags
    // (тобто, так як в нас звязок @ManyToMany і ми leftJoinAndSelect (підвязуємо всі поля з табл тегів),
    // то в нас будується проміжна табл в якій буде article_id, tag_id, tag_name)
    // Це дозволяє отримувати всі теги, що відносяться до статті.
    //*якби я тут не використовувала leftJoinAndSelect то звязок @ManyToMany,
    //*побудував проміжну табл до якої в нас немає доступу з article_id, tag_id
    qb.leftJoinAndSelect('article.user', 'user');
    //  Виконує ліве з'єднання з таблицею користувачів (user),
    //  що дозволяє додати інформацію про автора статті до результатів
    qb.leftJoinAndSelect(
      'user.followings',
      'following',
      'following.follower_id = :userId',
      { userId: userData.userId },
    ); // в результаті, тут отримуємо тільки тих юзерів, на яких підписаний конкретний користувач
    // (ідентифікатор якого передається через userData.userId)
    //leftJoinAndSelect виконує LEFT JOIN між таблицею користувачів (user) і таблицею,
    // яка містить їх підписки (followings). Завдякив використаню саме leftJoinAndSelect,
    // всі дані з пов'язаної таблиці followings будуть доступні в результаті
    // тут ми звертаємось до таблиці, яку у попередній строчці кода назвали "user",
    // тому прописуємо звернення 'user.followings'
    // тобто, 'user.followings' - звернення до зв'язку followings в таблиці user,
    // який представляє список користувачів, на яких підписаний user
    //'following.follower_id = :userId' це додаткова умова, щоб зробити вибірку трохи вужчою,
    // тобто ми хочемо додавати у вибірку лише тих юзерів
    // у кого follower_id = моєму id (userData.userId)
    // таким чином ми витягнемо всіх юзерів на кого я підписана
    // { userId: userData.userId }: задає значення параметру userId, який використовується в умові ON

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
    // повертає результат у вигляді масиву в якому буде міститись масив постів на авторів яких ми підписані
    // тобто, на яких підписаний конкретний користувач (ідентифікатор якого передається через userData.userId)
    // та їх кількість [ArticleEntity[], number]
  }

  public async getById(
    userData: IUserData,
    articleId: ArticleID,
  ): Promise<ArticleEntity> {
    const qb = this.createQueryBuilder('article');
    qb.leftJoinAndSelect('article.tags', 'tag');
    // додає всі теги, пов'язані зі статтею
    qb.leftJoinAndSelect('article.user', 'user');
    // додає інформацію про користувача, який є автором статті
    qb.leftJoinAndSelect(
      'user.followings',
      'following',
      'following.follower_id = :userId',
      { userId: userData.userId },
    );
    // приєднує таблицю підписок для автора статті, щоб перевірити,
    // чи автор є в підписках користувача userData
    qb.where('article.id = :articleId', { articleId });
    // фільтрує статтю за її унікальним articleId, щоб отримати лише один запис
    // де :articleId - це динамічний параметр, тобто це id поста який ми шукаємо
    // (ми id посту, який шукаємо, прописуємо в swagger в полі articleId)
    // { articleId } — це скорочений запис для { articleId: articleId }.
    // Він означає, що об’єкт буде мати властивість з назвою articleId,
    // і її значення буде взято із змінної, яка теж називається articleId
    // Отже, { articleId } — це скорочений спосіб створити об’єкт,
    // де ім'я ключа та значення однакові, що робить код коротшим і зручнішим
    return await qb.getOne();
  } // використовується для отримання конкретної статті за її ідентифікатором articleId,
  // додатково зберігаючи інформацію про теги, автора, а також перевіряючи,
  // чи автор статті є серед підписок користувача userData
}
