import { ApiProperty } from '@nestjs/swagger';

export class UserResDto {
  id: string;
  @ApiProperty({ example: 'John Doe' })
  name: string;
  age?: number;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
