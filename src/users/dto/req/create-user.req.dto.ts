import { ApiProperty } from '@nestjs/swagger';

export class CreateUserReqDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the User' })
  readonly name: string;
  @ApiProperty({
    example: 30,
    description: 'The age of the User',
    minimum: 0,
    maximum: 120,
  })
  readonly age: number;
  @ApiProperty({
    example: 'test@test.com',
    description: 'The email of the User',
  })
  readonly email: string;
  @ApiProperty({ example: 'password', description: 'The password of the User' })
  readonly password: string;
  @ApiProperty({
    example: 'admin',
    description: 'The role of the User',
    enum: ['admin', 'user'],
  })
  readonly role: string;
}
