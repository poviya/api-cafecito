import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum TypeStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
}

export enum Type {
  ARTICLE = 'ARTICLE',
  BLOG = 'BLOG',
}

export class FindAllDto {
  @IsEnum(TypeStatus)
  status: TypeStatus;

  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  slugPostCategory: string;

  @IsMongoId()
  @IsOptional()
  PostCategory: string;

  @IsEnum(Type)
  @IsOptional()
  type: Type;
}

export class FindAllUserDto {
  @IsEnum(TypeStatus)
  status: TypeStatus;

  @IsString()
  @IsOptional()
  search: string;

  @IsEnum(Type)
  @IsOptional()
  type: Type;
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

export enum TypeWeight {
  GR = 'GR',
  KG = 'KG',
}

export class UpdatePostDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsMongoId()
  @IsOptional()
  PostSalesUnit: string;

  @IsMongoId()
  @IsOptional()
  PostCategory: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsEnum(TypeWeight)
  @IsOptional()
  weight: TypeWeight;

  @IsNumber()
  @IsOptional()
  weightAmount: number;

  @IsBoolean()
  @IsOptional()
  comment: boolean;

  @IsString()
  @IsOptional()
  eventDate: string;
}

export class UpdateStatusDto {
  @IsEnum(TypeStatus)
  status: TypeStatus;
}
