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

export class FindAllDto {
  @IsEnum(TypeStatus)
  status: TypeStatus;

  @IsString()
  search: string;
}

export class FindAllUserDto {
  @IsEnum(TypeStatus)
  status: TypeStatus;

  @IsString()
  @IsOptional()
  search: string;
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
  PostSalesUnit: string;

  @IsMongoId()
  PostCategory: string;

  @IsNumber()
  price: number;

  @IsEnum(TypeWeight)
  weight: TypeWeight;

  @IsNumber()
  weightAmount: number;

  @IsBoolean()
  @IsOptional()
  comment: boolean;
}

export class UpdateStatusDto {
  @IsEnum(TypeStatus)
  status: TypeStatus;
}
