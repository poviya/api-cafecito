import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Money } from './entities/money.entity';

@Injectable()
export class MoneyService {
  constructor(
    @InjectModel(Money.name)
    private readonly MoneyModel: Model<Money>,
  ) {}

  async create(createDto: any): Promise<Money> {
    const res = await this.MoneyModel.create(createDto);
    return res;
  }

  async edit(ID: string, datosDTO: any): Promise<any> {
    const res = await this.MoneyModel.updateOne({ _id: ID }, datosDTO, {
      new: true,
    });
    return res;
  }

  async findAll(): Promise<Money[]> {
    return this.MoneyModel.find().sort({ iso: 1 }).exec();
  }

  async findOne(ID: string) {
    let res: any;
    if (isValidObjectId(ID)) {
      res = await this.MoneyModel.findById(ID).exec();
    }

    if (!res) throw new NotFoundException(`Id, name or no "${ID}" not found`);
    return res;
  }

  async findOneIso(dataDto: any): Promise<any> {
    const res = await this.MoneyModel.findOne({ iso: dataDto.iso }).exec();
    if (!res) throw new NotFoundException('does not exist!');
    return res;
  }
  async delete(id: string) {
    const res = await this.MoneyModel.findByIdAndRemove({ _id: id }).exec();
    return res;
  }
}
