import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Money, MoneySchema } from './entities/money.entity';
import { MoneyController } from './money.controller';
import { MoneyService } from './money.service';

@Module({
  controllers: [MoneyController],
  providers: [MoneyService],
  imports: [
    MongooseModule.forFeature([{ name: Money.name, schema: MoneySchema }]),
  ],
  exports: [MongooseModule],
})
export class MoneyModule {}
