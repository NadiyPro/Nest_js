import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { TagEntity } from '../../../database/entities/tag.entity';

@Injectable()
export class TagRepository extends Repository<TagEntity> {
  // Repository<TagEntity> — TagRepository успадковується від класу Repository,
  // який дозволяє використовувати всі методи ORM TypeORM для роботи з TagEntity
  constructor(private readonly dataSource: DataSource) {
    super(TagEntity, dataSource.manager);
    // super() ініціалізує батьківський клас (Repository<TagEntity>) з параметрами:
    // TagEntity — сутність, з якою працює цей репозиторій.
    // DataSource - це клас, через який TypeORM виконує запити до бази,
    // керує транзакціями та забезпечує доступ до Repository і EntityManager.
    // dataSource.manager — це менеджер БД ("помічник") від TypeORM, який знає,
    // як спілкуватися з базою даних, і ми використовуємо його для роботи з TagEntity
    // (дозволяє використовувати всі методи create/findAll/findOne/update/remove/delete і т.п)
  }

  public async getPopular(): Promise<TagEntity[]> {
    const qb = this.createQueryBuilder('tag');
    // createQueryBuilder - це метод у TypeORM використовується для побудови складних SQL-запитів
    // createQueryBuilder на основі TagRepository, який успадковує Repository<TagEntity>,
    // TypeORM розуміє, що цей QueryBuilder прив’язаний до сутності TagEntity, тобто
    // createQueryBuilder('tag') — створює запит, де tag є псевдонімом таблиці TagEntity
    qb.leftJoin('tag.articles', 'article');
    // leftJoin виконує ліве з'єднання між таблицями,
    // але не додає поля з приєднаної таблиці до вибірки, використовуємо суто для обчислення кількість постів,
    // пов'язаних з тегом (тобто тут ми НЕ повертаємо таблицю/поля ззовні,
    // а просто використовуємо дану звязку для обчислення кількості постів (COUNT(article.id)))
    // 'tag.articles' - Це вказує на те, що поле article знаходиться у таблиці tag (побудованої на основі TagEntity)
    // Це поле зазвичай представляє зв'язок між статтями і тегами.
    // 'article': Це псевдонім для сутності тегів,
    // який дозволяє звертатися до полів з таблиці article.id у запиті,
    // щоб підрахувати кількість постів з найпопулярнішими тегами
    // наприклад, з постом 1111 маэмо 2 теги, з постом 3333 лише 1 тег,
    // отже пост 1111 буде найпопулярніший після сортування, того що ми нижче проводимо
    qb.addSelect('COUNT(article.id)', 'tag_articleCount');
    // COUNT(article.id) рахує кількість статей для кожного тегу
    // addSelect додає обчислюване поле tag_articleCount, яке містить кількість статей,
    // пов’язаних з кожним тегом.
    // в сирому SQL до поля articleCount з TagEntity, атоматом присвоюється еліас (as) tag_articleCount,
    // тому ми тут для повернення повернення результату обчислення, поле називаємо саме tag_articleCount
    qb.groupBy('tag.id');
    // groupBy групує результати за tag.id,
    // щоб обчислення кількості статей було застосоване до кожного окремого тега
    qb.orderBy('"tag_articleCount"', 'DESC');
    // сортує результати за обчислюваним полем tag_articleCount у порядку спадання (DESC),
    // щоб найпопулярніші теги були першими
    qb.limit(10);
    // обмежує результати десятьма тегами (ліміт на кількість відображенних тегів)
    return await qb.getMany();
    // повертає масив TagEntity[] з результатами
  }
}
// Метод getPopular() отримує десять тегів з найбільшою кількістю пов’язаних статей.
// Він обчислює кількість статей для кожного тегу,
// сортує теги за цією кількістю і повертає список популярних тегів
