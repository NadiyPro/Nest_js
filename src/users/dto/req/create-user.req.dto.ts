import { ApiProperty } from '@nestjs/swagger';

export class CreateUserReqDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly age?: number;
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly password: string;
  @ApiProperty()
  readonly role: string;
}
