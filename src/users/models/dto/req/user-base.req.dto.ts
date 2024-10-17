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
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @ValidateIf((obj) => !obj.phone)
  @IsString()
  @IsEmail() // замість цього правильніше кидати @Matches з регуляркою
  email: string;

  @Transform(TransformHelper.trim)
  @ValidateIf((obj) => !obj.email)
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

  @ApiProperty({ example: '12qw4qeASD' }) // для опису даних моделей даних в DTO
  @Transform(TransformHelper.trim)
  @IsNotIn(['password', '123456', 'qwerty'])
  // @IsNotIn Перевіряє, чи значення не входить до масиву заборонених значень.
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must contain at least 1 letter, 1 number, and be at least 8 characters long',
  })
  password: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CarBaseReqDto)
  cars: CarBaseReqDto[];
}
