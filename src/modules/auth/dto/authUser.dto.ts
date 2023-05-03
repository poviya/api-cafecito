import {
  IsEmail,
  IsMongoId,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class AuthUserDto {
  @IsMongoId()
  _id: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsMongoId()
  Site: string;

  @IsObject()
  Profile: any;

  @IsObject()
  Cover: any;
}

export class EmailVerifiedDto {
  @IsString()
  codeVerified: number;
}
