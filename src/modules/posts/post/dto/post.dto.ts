import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

export enum TypeWeight {
  GR = 'GR',
  KG = 'KG',
}

export enum TypeStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
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

  @IsBoolean()
  @IsOptional()
  comment: boolean;
}

export class UpdateStatusDto {
  @IsEnum(TypeStatus)
  status: TypeStatus;
}
