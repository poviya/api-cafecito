import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Money, MoneySchema } from '../money/entities/money.entity';
import {
  MoneyConvert,
  MoneyConvertSchema,
} from './entities/money-convert.entity';
import { MoneyConvertController } from './money-convert.controller';
import { MoneyConvertService } from './money-convert.service';

@Module({
  controllers: [MoneyConvertController],
  providers: [MoneyConvertService],
  imports: [
    MongooseModule.forFeature([
      { name: Money.name, schema: MoneySchema },
      { name: MoneyConvert.name, schema: MoneyConvertSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MoneyConvertModule {}
