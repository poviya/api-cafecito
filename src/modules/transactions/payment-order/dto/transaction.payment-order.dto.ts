import { IsString } from 'class-validator';

export class TransactionPaymentOrderDto {
  @IsString()
  codeCollection: string;
}
