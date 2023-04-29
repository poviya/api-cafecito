import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [CustomerModule],
  exports: [CustomerModule],
})
export class CustomersModule {}
