import { PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export enum TypeMethod {
  PAYPAL = 'PAYPAL',
  PAYMENT_LINK = 'PAYMENT_LINK',
}

export class CreatePaypalUserTransferDto {
  // @IsEnum(TypeMethod)
  // type: TypeMethod;

  @IsMongoId()
  Money: string;

  @IsEmail()
  email: string;
}

export class UpdatePaypalUserTransferDto extends PartialType(
  CreatePaypalUserTransferDto,
) {}

export class CreateLinkUserTransferDto {
  // @IsEnum(TypeMethod)
  // type: TypeMethod;

  @IsMongoId()
  Money: string;

  @IsString()
  link: string;

  @IsNumber()
  amount: number;
}

export class UpdateLinkUserTransferDto extends PartialType(
  CreateLinkUserTransferDto,
) {}
