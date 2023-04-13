import { Module } from '@nestjs/common';
import { MoneyModule } from './money/money.module';
import { MoneyConvertModule } from './money-convert/money-convert.module';

@Module({
  imports: [MoneyModule, MoneyConvertModule],
})
export class MoneysModule {}
