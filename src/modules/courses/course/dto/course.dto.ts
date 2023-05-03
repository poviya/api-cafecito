import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCourseDto {}

export enum TypeStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
}

export class UpdateCourseDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  purposes: string;

  @IsString()
  @IsOptional()
  benefits: string;

  @IsString()
  @IsOptional()
  whoIsItFor: string;

  @IsArray()
  @IsOptional()
  content: object;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  duration: string;

  @IsString()
  @IsOptional()
  modality: string;

  @IsString()
  @IsOptional()
  schedule: string;

  @IsString()
  @IsOptional()
  certifiedHours: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  @IsOptional()
  comment: boolean;
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

export class FindAllCourseDto {
  @IsMongoId()
  Site: string;
}

export class UpdateStatusDto {
  @IsEnum(TypeStatus)
  status: TypeStatus;
}
