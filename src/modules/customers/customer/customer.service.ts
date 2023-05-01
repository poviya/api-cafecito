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
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
  ) {}

  async create(dataDto: CreateCustomerDto) {
    try {
      const resFindOneEmail = await this.findOneEmail(dataDto.email);
      if (!resFindOneEmail) {
        const res = await this.customerModel.create(dataDto);
        return res;
      } else {
        const resUpdate = await this.customerModel.findOneAndUpdate(
          { _id: resFindOneEmail._id },
          dataDto,
          {
            new: true,
          },
        );
        return resUpdate;
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, dataDto: any): Promise<any> {
    this.findOne(id);

    try {
      const res = await this.customerModel.findOneAndUpdate(
        { _id: id },
        dataDto,
        {
          new: true,
        },
      );
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all customer`;
  }

  async findOneEmail(email: string) {
    const res = await this.customerModel.findOne({ email: email });
    return res;
  }

  findOne(id: string) {
    return `This action returns a #${id} customer`;
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
