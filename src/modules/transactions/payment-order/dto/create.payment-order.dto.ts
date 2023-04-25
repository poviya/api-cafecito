import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/modules/users/user/entities/user.entity';

export enum PaymentType {
  SALE_CREDIT = 'SALE_CREDIT',
  SALE_ARTICLE = 'SALE_ARTICLE',
}

export enum TypeSaleContent {
  MEMBERSHIP = 'MEMBERSHIP',
  POST = 'POST',
  MESSAGE = 'MESSAGE',
  TIP_POST = 'TIP_POST',
  TIP_ACCOUNT = 'TIP_ACCOUNT',
  TIP_MESSAGE = 'TIP_MESSAGE',
}

class PaymentDetails {
  // @IsEnum(TypeSaleContent)
  // contentType: TypeSaleContent;

  @IsObject()
  data: any;
}

export class CreatePaymentOrderDto {
  @IsMongoId()
  @IsOptional()
  Sender: User;

  @IsBoolean()
  production: boolean;

  @IsMongoId()
  Post: string;

  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ValidateNested()
  @Type(() => PaymentDetails)
  paymentDetails: PaymentDetails;
}
