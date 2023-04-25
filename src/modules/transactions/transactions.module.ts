import { Module } from '@nestjs/common';
import { PaymentOrderModule } from './payment-order/payment-order.module';
@Module({
  imports: [PaymentOrderModule],
})
export class TransactionsModule {}
