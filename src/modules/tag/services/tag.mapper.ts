import { Injectable } from '@nestjs/common';

import { TagEntity } from '../../../database/entities/tag.entity';
import { TagResDto } from '../models/dto/res/tag.res.dto';

@Injectable()
export class TagMapper {
  public static toResListDto(data: TagEntity[]): TagResDto[] {
    return data.map(this.toResDto);
  }

  public static toResDto(data: TagEntity): TagResDto {
    return {
      id: data.id,
      // ідентифікатор тегу
      name: data.name,
      // назва тегу
      articleCount: data['articleCount'] || 0,
      // кількість постів повязаних з тегом
    };
  }
}
