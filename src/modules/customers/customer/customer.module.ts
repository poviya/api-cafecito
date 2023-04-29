import { Module, forwardRef } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './entities/customer.entity';
import { CountryModule } from 'src/modules/countries/country/country.module';
import { PaymentOrderModule } from 'src/modules/transactions/payment-order/payment-order.module';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    forwardRef(() => CountryModule),
    forwardRef(() => PaymentOrderModule),
  ],
  exports: [MongooseModule, CustomerService],
})
export class CustomerModule {}
