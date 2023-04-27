import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoneyConvertService } from 'src/modules/moneys/money-convert/money-convert.service';
import {
  PaymentOrder,
  PaymentOrderSchema,
} from './entities/payment-order.entity';
import { PaymentOrderController } from './payment-order.controller';
import { PaymentOrderService } from './payment-order.service';
import { CountryModule } from 'src/modules/countries/country/country.module';
import { CountryStateModule } from 'src/modules/countries/country-state/country-state.module';
import { MoneyModule } from 'src/modules/moneys/money/money.module';
import { MoneyConvertModule } from 'src/modules/moneys/money-convert/money-convert.module';
import { PostModule } from 'src/modules/posts/post/post.module';
import { CourseModule } from 'src/modules/courses/course/course.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: PaymentOrder.name, schema: PaymentOrderSchema },
    ]),
    forwardRef(() => CountryModule),
    forwardRef(() => CountryStateModule),
    forwardRef(() => MoneyModule),
    forwardRef(() => MoneyConvertModule),
    forwardRef(() => PostModule),
    forwardRef(() => CourseModule),
  ],
  exports: [MongooseModule],
  providers: [PaymentOrderService, MoneyConvertService],
  controllers: [PaymentOrderController],
})
export class PaymentOrderModule {}
