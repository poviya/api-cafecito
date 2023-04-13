import { IsEmail, IsMongoId, isObject, IsString } from 'class-validator';

export class EmailDto {
  @IsEmail()
  email: string;
}

export class UsernameDto {
  @IsString()
  username: string;
}

export class SlugDto {
  @IsString()
  username: string;

  @IsMongoId()
  Site: string;
}
