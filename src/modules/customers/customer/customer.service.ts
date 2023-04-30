import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.entity';
import { Model } from 'mongoose';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private readonly countryModel: Model<Customer>,
  ) {}

  async create(dataDto: CreateCustomerDto) {
    try {
      const resFindOneEmail = await this.findOneEmail(dataDto.email);
      if (!resFindOneEmail) {
        const res = await this.countryModel.create(dataDto);
        return res;
      } else {
        return resFindOneEmail;
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all customer`;
  }

  async findOneEmail(email: string) {
    const res = await this.countryModel.findOne({ email: email });
    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    //this.logger.error(error);
    //console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
