import { IsBoolean, IsMongoId, IsNumber } from 'class-validator';

export class CreateProductPaymentOrderDto {
  @IsMongoId()
  Post: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  amountDiscount: number;

  @IsBoolean()
  production: boolean;
}
