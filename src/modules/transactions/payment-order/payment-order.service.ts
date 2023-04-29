import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaymentOrder } from './entities/payment-order.entity';
import { Posts } from 'src/modules/posts/post/entities/post.entity';
import { PostService } from 'src/modules/posts/post/post.service';
import { CreateProductPaymentOrderDto } from './dto/index.dto';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

import { map } from 'rxjs';
import { CustomerService } from 'src/modules/customers/customer/customer.service';

@Injectable()
export class PaymentOrderService {
  constructor(
    @InjectModel(PaymentOrder.name)
    private readonly paymentOrderModel: Model<PaymentOrder>,
    @InjectModel(Posts.name)
    private readonly postService: PostService,
    private readonly httpService: HttpService,
    private readonly customerService: CustomerService,
  ) {}

  async createProduct(dataDto: CreateProductPaymentOrderDto) {
    try {
      const resPost = await this.postService.findById(dataDto.Post);
      const data = {
        codeCollection: `CE${this.generateCodePayment()}`,
        amount: resPost.price,
        Money: resPost.Money,
        quantity: dataDto.quantity,
        amountBalance:
          Number(resPost.price) * Number(dataDto.quantity) -
          Number(dataDto.amountDiscount),
        amountDiscount: dataDto.amountDiscount,
        production: dataDto.production,
        paymentMethod: 'CARD',
        paymentType: 'SALE_PRODUCT',
        paymentDetails: {
          Post: resPost,
        },
      };

      const dataCallback = {
        poviyaCommerceId: process.env.POVIYA_COMMERCE_ID,
        poviyaUrlCallback: process.env.POVIYA_URL_CALLBACK,
        poviyaUrlReturn: process.env.POVIYA_URL_RETURN,
        proviyaProduction: !!process.env.POVIYA_PRODUCTION,
        amount: Number(data.amountBalance),
        money: resPost.Money.iso,
        codeCollection: data.codeCollection,
      };
      // const url = 'http://192.168.43.253:5000/api/payment-order/checkout';
      const url = 'https://api.poviya.com/api/payment-order/checkout';
      const resProcessor = await this.httpService
        .post(url, dataCallback)
        .pipe(map((response) => response.data))
        .toPromise();
      if (resProcessor.ok == true) {
        const resCreate = await this.paymentOrderModel.create(data);
        return resCreate;
      } else {
        return false;
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async createCourse(dataDto: any): Promise<any> {
    const data = {
      Course: dataDto.Course,
      codeCollection: dataDto.codeCollection,
      amount: dataDto.amount,
      Money: dataDto.Money,
      amountBalance: dataDto.price,
      amountDiscount: dataDto.amountDiscount,
      production: dataDto.production,
    };
    const resCreate = await this.paymentOrderModel.create(data);
    return resCreate;
  }

  async updateOne(codeCollection: string, datosDTO: any): Promise<any> {
    const res = await this.paymentOrderModel.findOneAndUpdate(
      { codeCollection: codeCollection },
      datosDTO,
      {
        new: true,
      },
    );
    return res;
  }

  async transaction(dataDto: any): Promise<any> {
    try {
      console.log(dataDto);
      let resPaymentOrder: any;
      const res = await this.findOneCodeCollection(
        dataDto.receipt.req_reference_number,
      );
      if (!res) {
        return {
          ok: false,
          data: {},
          message: 'No existe codigo de recaudacion',
        };
      }

      if (dataDto.receipt.decision == 'ACCEPT') {
        const dataCustomer = {
          name: res.Customer.name,
          lastname: res.Customer.lastname,
          email: res.Customer.email,
          phone: res.Customer.phone,
          address: res.Customer.address,
          city: res.Customer.city,
          state: res.Customer.state,
          country: res.Customer.country,
          postalCode: res.Customer.postalCode,
        };
        const resCustomer = await this.customerService.create(dataCustomer);
        const datosDTOPaymentOrder = {
          status: 'PAYMENT',
          Customer: resCustomer._id,
          receipt: dataDto.receipt,
        };

        resPaymentOrder = await this.paymentOrderModel.findOneAndUpdate(
          { _id: res._id },
          datosDTOPaymentOrder,
          {
            new: true,
          },
        );
      } else {
        const datosDTOPaymentOrder = {
          status: 'ERROR',
          receipt: dataDto.receipt,
        };

        resPaymentOrder = await this.paymentOrderModel.findOneAndUpdate(
          { _id: dataDto.dataPaymentOder._id },
          datosDTOPaymentOrder,
          {
            new: true,
          },
        );
      }
      return {
        ok: true,
        data: resPaymentOrder,
        message: 'Exito en la transaccion',
      };
    } catch (error) {}
  }

  async findAll(): Promise<PaymentOrder[]> {
    return this.paymentOrderModel.find().sort({ codigo: 1 }).exec();
  }

  async findOneCodeCollection(codeCollection: string): Promise<PaymentOrder> {
    const res = this.paymentOrderModel
      .findOne({
        codeCollection: codeCollection,
      })
      .populate('Money')
      .populate('Customer')
      .exec();
    return res;
  }

  async findById(ID: string) {
    let res: any;

    if (isValidObjectId(ID)) {
      res = await this.paymentOrderModel.findById(ID).populate('Money').exec();
    }

    if (!res) throw new NotFoundException(`Id, name or no "${ID}" not found`);
    return res;
  }

  async remove(id: string) {
    const { deletedCount } = await this.paymentOrderModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0)
      throw new BadRequestException(`Id "${id}" not found`);

    return;
  }

  async delete(id: string) {
    const res = await this.paymentOrderModel
      .findByIdAndRemove({
        _id: id,
      })
      .exec();
    return res;
  }

  sumDaysToDate(days: number, date) {
    /*
        var x = new Date();
        var y = new Date();

        console.log(new Date());
        var m = x.setDate(x.getDate() +days);
        var n = y.setDate(y.getDate() + 6);
        console.log(new Date(m));
        console.log(new Date(n));
        console.log( y > x);
        */
    const a = new Date(date);
    const m = a.setDate(a.getDate() + days);
    return m;
  }

  subtractDates(dateOne, dateTwo) {
    const fecha1 = new Date(dateOne);
    const fecha2 = new Date(dateTwo);

    const resta = fecha1.getTime() - fecha2.getTime();
    const res = Math.round(resta / (1000 * 60 * 60 * 24));
    return res;
  }

  generateCodePayment() {
    return Date.now();
  }

  async updatedField(): Promise<any> {
    const list = await this.paymentOrderModel.find();
    for (const item of list) {
      // let data = {};
      // data = {
      //   PostAdProduct: item.AdProduct,
      // };
      // const res = await this.paymentOrderModel.updateOne(
      //   { _id: item._id },
      //   data,
      //   {
      //     new: true,
      //   },
      // );
      await this.paymentOrderModel.updateOne(
        { _id: item._id },
        {
          $unset: { AdProduct: 1 },
        },
        {
          new: true,
        },
      );
      console.log(item._id);
    }
    return null;
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
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}