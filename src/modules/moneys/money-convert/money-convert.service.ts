import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Money } from '../money/entities/money.entity';
import { MoneyConvert } from './entities/money-convert.entity';

@Injectable()
export class MoneyConvertService {
  amountConvert: number;
  moneyConvert: string;

  constructor(
    @InjectModel(Money.name)
    private readonly MoneyModel: Model<Money>,
    @InjectModel(MoneyConvert.name)
    private readonly MoneyConvertModel: Model<MoneyConvert>,
  ) {}

  async create(createDto: any): Promise<MoneyConvert> {
    const res = await this.MoneyConvertModel.create(createDto);
    return res;
  }

  async edit(ID: string, datosDTO: any): Promise<any> {
    const res = await this.MoneyConvertModel.updateOne({ _id: ID }, datosDTO, {
      new: true,
    });
    return res;
  }

  async convert(dataDto: any): Promise<any> {
    const resMoneyOf = await this.MoneyModel.findOne({
      iso: dataDto.moneyOf,
    });
    const resMoneyA = await this.MoneyModel.findOne({
      iso: dataDto.moneyA,
    });
    const res = await this.MoneyConvertModel.findOne({
      MoneyOf: resMoneyOf.id,
      MoneyA: resMoneyA.id,
    });
    const resInv = await this.MoneyConvertModel.findOne({
      MoneyOf: resMoneyA.id,
      MoneyA: resMoneyOf.id,
    })
      .populate('MoneyOf')
      .populate('MoneyA')
      .exec();

    if (res) {
      this.amountConvert = dataDto.amount * res.amountBuy;
      this.moneyConvert = resMoneyA.id;
    } else if (resInv) {
      this.amountConvert = dataDto.amount / resInv.amountSale;
      this.moneyConvert = resMoneyA.id;
    } else {
      this.amountConvert = dataDto.amount;
      this.moneyConvert = resMoneyA.id;
    }
    return {
      amount: this.amountConvert,
      Money: this.moneyConvert,
    };
  }

  async findAll(): Promise<MoneyConvert[]> {
    return this.MoneyConvertModel.find()
      .populate('MoneyOf')
      .populate('MoneyA')
      .sort({ codigo: 1 })
      .exec();
  }

  async findOne(id: string): Promise<MoneyConvert> {
    return this.MoneyConvertModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const res = await this.MoneyConvertModel.findByIdAndRemove({
      _id: id,
    }).exec();
    return res;
  }
}
