import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotIn,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { GenderEnum } from '../../../enums/gender.enum';

export class CarBaseReqDto {
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsString()
  @Length(3, 50)
  producer: string;

  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsString()
  @Length(3, 50)
  model: string;

  @ApiProperty({ example: 2021 })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year: number;
}

export class UserBaseReqDto {
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsString()
  @Length(3, 50)
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(150)
  @IsOptional()
  age?: number;

  @ApiProperty({ example: 'string@test.com' })
  @Transform(TransformHelper.trim) // Видаляє пробіли з початку та кінця рядка
  @Transform(TransformHelper.toLowerCase) // Приводить переданий рядок до нижнього регістру
  @ValidateIf((obj) => !obj.phone)
  @IsString()
  @IsEmail() // замість цього правильніше кидати @Matches з регуляркою
  email: string;

  @Transform(TransformHelper.trim)
  @ValidateIf((obj) => !obj.email)
  // означає, що валідація для поля буде відбуватися лише тоді,
  // коли поле email не заповнене
  // (тобто, коли email відсутній або має значення null, undefined або порожній рядок).
  @IsString()
  phone: string;

  @IsOptional()
  // параметр не обовязковий, тобто навіть якщо не пройде перевірку,
  // запит всеодно буде успішним
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsBoolean()
  @IsOptional()
  isStudent: boolean = false;

  @ApiProperty({ example: '12qw4qeASD' })
  // для опису даних моделей даних в DTO,
  // дозволяє створювати візуальні інтерфейси для тестування і документування API
  @Transform(TransformHelper.trim)
  @IsNotIn(['password', '123456', 'qwerty'])
  // @IsNotIn Перевіряє, чи значення не входить до масиву заборонених значень.
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must contain at least 1 letter, 1 number, and be at least 8 characters long',
  })
  password: string;

  @ValidateNested({ each: true })
  // @ValidateNested({ each: true })- це означає,
  // що валідація буде виконуватись не лише для основного об'єкта,
  // а й для його вкладених об'єктів або елементів масиву.
  // each: true вказує, що якщо поле є масивом,
  // валідація має виконуватись для кожного елемента цього масиву.
  // Якщо поле не є масивом, валідація буде застосовуватись до самого об'єкта
  @IsArray()
  @Type(() => CarBaseReqDto)
  // перетворення (трансформації) вхідних даних у конкретний тип або клас
  // поле (або об'єкт) має бути перетворене у тип або клас CarBaseReqDto,
  // коли дані надходять у вигляді JSON або іншого формату
  cars: CarBaseReqDto[];
}
