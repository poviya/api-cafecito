import { IsEnum, IsMongoId, IsNumber, IsString } from 'class-validator';

export class FindAllUserDto {
  @IsString()
  username: string;

  @IsMongoId()
  Site: string;
}

export class FindAllUserMediaDto {
  @IsMongoId()
  User: string;

  @IsMongoId()
  Site: string;

  @IsString()
  type: string;
}

export class FindAllPostDto {
  @IsMongoId()
  Site: string;
}

export class AnalyzeHastagsDto {
  @IsString()
  text: string;
}

export enum TypeView {
  FREE = 'FREE',
  DAY = 'DAY',
  UNLIMITED = 'UNLIMITED',
}

export class UpdatePostDto {
  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsEnum(TypeView)
  type: TypeView;
}
