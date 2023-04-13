import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { AuthUserDto } from 'src/modules/auth/dto/authUser.dto';
import { UserTransfer } from './entities/user-transfer.entity';
import {
  CreateLinkUserTransferDto,
  CreatePaypalUserTransferDto,
  UpdateLinkUserTransferDto,
  UpdatePaypalUserTransferDto,
} from './dto/user-transfer.dto';

@Injectable()
export class UserTransferService {
  constructor(
    @InjectModel(UserTransfer.name)
    private readonly UserTransferModel: Model<UserTransfer>,
  ) {}

  async createPaypal(dataDto: CreatePaypalUserTransferDto, user: AuthUserDto) {
    const resOne = await this.UserTransferModel.findOne({
      User: user._id,
      type: 'PAYPAL',
    });
    if (resOne) throw new BadRequestException(`Exists`);
    try {
      const data: UserTransfer = {
        User: user._id,
        Money: dataDto.Money,
        type: 'PAYPAL',
        details: {
          email: dataDto.email,
        },
      };
      const res = await this.UserTransferModel.create(data);
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updatePaypal(id: string, dataDto: UpdatePaypalUserTransferDto) {
    await this.findOne(id);
    try {
      const data = {
        details: {
          email: dataDto.email,
        },
      };
      const res = await this.UserTransferModel.findOneAndUpdate(
        { _id: id },
        data,
        {
          new: true,
        },
      );
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async createLink(dataDto: CreateLinkUserTransferDto, user: AuthUserDto) {
    const resOne = await this.UserTransferModel.findOne({
      User: user._id,
      type: 'LINK_PAY',
    });
    if (resOne) throw new BadRequestException(`Exists`);
    try {
      const data: UserTransfer = {
        User: user._id,
        Money: dataDto.Money,
        type: 'LINK_PAY',
        details: {
          link: dataDto.link,
          amount: dataDto.amount,
        },
      };
      const res = await this.UserTransferModel.create(data);
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateLink(id: string, dataDto: UpdateLinkUserTransferDto) {
    await this.findOne(id);
    try {
      const data = {
        details: {
          link: dataDto.link,
          amount: dataDto.amount,
        },
      };
      const res = await this.UserTransferModel.findOneAndUpdate(
        { _id: id },
        data,
        {
          new: true,
        },
      );
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAllUser(user: AuthUserDto) {
    console.log('user');
    try {
      const res = await this.UserTransferModel.find({ User: user._id })
        .populate('Money')
        .sort({ type: 1 })
        .exec();
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    console.log('all');
    try {
      const res = await this.UserTransferModel.find()
        .populate('Money')
        .sort({ createdAt: 1 })
        .exec();
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    let res: any;

    if (isValidObjectId(id)) {
      res = await this.UserTransferModel.findById(id);
    }

    if (!res) throw new NotFoundException(`Id, name or no "${id}" not found`);
    return res;
  }

  async remove(id: string) {
    const { deletedCount } = await this.UserTransferModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0) throw new NotFoundException(`Id "${id}" not found`);

    return;
  }

  private handleDBExceptions(error: any) {
    if (error.status === 400) {
      throw new BadRequestException(`Exists in db`);
    }

    if (error.code === 11000) {
      throw new BadRequestException(
        `Exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    //this.logger.error(error);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
