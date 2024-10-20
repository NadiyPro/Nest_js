import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // назва табл в БД
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  // Це декоратор, який вказує, що поле id є первинним ключем (PRIMARY KEY)
  // і генерується автоматично у форматі UUID
  // (універсальний унікальний ідентифікатор
  id: string;
  // Поле id буде використовуватися для
  // унікальної ідентифікації кожного запису (користувача).

  @Column('text')
  // Вказує, що це поле буде зберігатися в базі даних як тип text
  firstName: string;
  // Поле firstName зберігає ім'я користувача

  @Column('text', { unique: true })
  // unique: true - означає, що значення цього поля повинні бути унікальними
  email: string;

  @Column('text')
  lastName: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('text')
  bio: string;

  // @VirtualColumn({
  //   query: () => 'SELECT CONCAT(firstName, lastName) FROM users WHERE id = id',
  // })
  // fullName: string;
}
