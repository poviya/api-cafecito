import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsMongoId,
  IsNumber,
  isObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum TypeSaleContent {
  MEMBERSHIP = 'MEMBERSHIP',
  POST = 'POST',
  MESSAGE = 'MESSAGE',
  TIP_POST = 'TIP_POST',
  TIP_ACCOUNT = 'TIP_ACCOUNT',
  TIP_MESSAGE = 'TIP_MESSAGE',
}

class PaymentDetails {
  @IsEnum(TypeSaleContent)
  contentType: TypeSaleContent;

  @IsObject()
  data: any;
}

class PaymentDetailsAdSale {
  @IsEnum(TypeSaleContent)
  contentType: TypeSaleContent;

  @IsObject()
  data: any;
}

export class CreateSaleContentDto {
  @IsMongoId()
  @IsOptional()
  Sender: string;

  @IsMongoId()
  Receiver: string;

  @IsNumber()
  amount: number;

  @IsObject()
  Money: any;

  @IsMongoId()
  @IsOptional()
  Site: string;

  @IsBoolean()
  production: boolean;

  @ValidateNested()
  @Type(() => PaymentDetails)
  paymentDetails: PaymentDetails;

  @IsString()
  @IsOptional()
  message: string;

  // @IsEnum(TypeSaleContent)
  // contentType: TypeSaleContent;
}

export class CreateMembershipDto {
  @IsMongoId()
  Membership: string;

  @IsMongoId()
  Receiver: string;

  @IsMongoId()
  @IsOptional()
  Site: string;

  @IsBoolean()
  production: boolean;
}

export class CreateAdSaleDto {
  @IsMongoId()
  @IsOptional()
  Sender: string;

  @IsMongoId()
  Receiver: string;

  @IsNumber()
  amount: number;

  @IsObject()
  Money: any;

  @IsMongoId()
  @IsOptional()
  Site: string;

  @IsBoolean()
  production: boolean;

  @IsMongoId()
  @IsOptional()
  Post: string;

  @IsObject()
  PostAdProduct: any;

  @ValidateNested()
  @Type(() => PaymentDetailsAdSale)
  paymentDetails: PaymentDetailsAdSale;

  @IsString()
  @IsOptional()
  message: string;
}
