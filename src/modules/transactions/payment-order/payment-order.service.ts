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
import {
  configNodemailer,
  templateConfirmPaymentCafecitoEs,
  transporterNodemailerOnlypu,
} from 'src/common/constants';
import { TelegramBotService } from 'src/modules/notifications/telegram/telegramBot.service';
import { CourseService } from 'src/modules/courses/course/course.service';

@Injectable()
export class PaymentOrderService {
  constructor(
    @InjectModel(PaymentOrder.name)
    private readonly paymentOrderModel: Model<PaymentOrder>,
    @InjectModel(Posts.name)
    private readonly postModel: Model<Posts>,
    private postService: PostService,
    private courseService: CourseService,
    private readonly httpService: HttpService,
    private readonly customerService: CustomerService,
    private readonly telegramBotService: TelegramBotService,
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
        production: process.env.POVIYA_PRODUCTION == 'true' ? true : false,
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
        proviyaProduction:
          process.env.POVIYA_PRODUCTION == 'true' ? true : false,
        amount: Number(data.amountBalance),
        money: resPost.Money.iso,
        codeCollection: data.codeCollection,
      };
      console.log(dataCallback);
      const url = process.env.POVIYA_URL_CHECKOUT;
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
    try {
      console.log(dataDto);
      const resCourse = await this.courseService.findById(dataDto.Course);
      const data = {
        codeCollection: `CE${this.generateCodePayment()}`,
        amount: resCourse.price,
        Money: resCourse.Money,
        quantity: dataDto.quantity,
        amountBalance:
          Number(resCourse.price) * Number(dataDto.quantity) -
          Number(dataDto.amountDiscount),
        amountDiscount: dataDto.amountDiscount,
        production: process.env.POVIYA_PRODUCTION == 'true' ? true : false,
        paymentMethod: 'CARD',
        paymentType: 'SALE_COURSE',
        paymentDetails: {
          Course: resCourse,
        },
      };

      const dataCallback = {
        poviyaCommerceId: process.env.POVIYA_COMMERCE_ID,
        poviyaUrlCallback: process.env.POVIYA_URL_CALLBACK,
        poviyaUrlReturn: process.env.POVIYA_URL_RETURN,
        proviyaProduction:
          process.env.POVIYA_PRODUCTION == 'true' ? true : false,
        amount: Number(data.amountBalance),
        money: resCourse.Money.iso,
        codeCollection: data.codeCollection,
      };
      console.log(dataCallback);
      const url = process.env.POVIYA_URL_CHECKOUT;
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
      //this.handleDBExceptions(error);
    }
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
      // create customer
      const dataCustomer = {
        name: dataDto.customer.name,
        lastname: dataDto.customer.lastname,
        email: dataDto.customer.email,
        phone: dataDto.customer.phone,
        address: dataDto.customer.address,
        city: dataDto.customer.city,
        state: dataDto.customer.state,
        country: dataDto.customer.country,
        postalCode: dataDto.customer.postalCode,
      };
      const resCustomer = await this.customerService.create(dataCustomer);

      if (dataDto.receipt.decision == 'ACCEPT') {
        const datosDTOPaymentOrder = {
          status: 'PAYMENT',
          Customer: resCustomer._id,
          receipt: dataDto.receipt,
        };

        resPaymentOrder = await this.paymentOrderModel
          .findOneAndUpdate({ _id: res._id }, datosDTOPaymentOrder, {
            new: true,
          })
          .populate('Customer');
      } else {
        const datosDTOPaymentOrder = {
          status: dataDto.receipt.decision,
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

  async notification(codeCollection: string): Promise<PaymentOrder> {
    const res = await this.paymentOrderModel
      .findOne({
        codeCollection: codeCollection,
      })
      .populate('Money')
      .populate('Customer')
      .exec();
    if (res.paymentType == 'SALE_PRODUCT') {
      // send telegram
      this.telegramBotService.newSaleProduct(res.paymentDetails['Post'], res);
      // send email
      const product = `Compra de ${res.paymentDetails['Post']['title']}`;
      await this.sendConfirmEmail(res, product);
    } else if (res.paymentType == 'SALE_COURSE') {
      // send telegram
      this.telegramBotService.newSaleCourse(res.paymentDetails['Course'], res);
      // send email
      const product = `Pago de ${res.paymentDetails['Course']['title']}`;
      await this.sendConfirmEmail(res, product);
    }
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

  async findAllPayments() {
    return this.paymentOrderModel
      .find({
        $or: [
          { status: 'PAYMENT' },
          { status: 'CANCELED' },
          { status: 'REVERTED' },
          { status: 'DECLINE' },
        ],
      })
      .populate([
        {
          path: 'Customer',
        },
        {
          path: 'Money',
        },
      ])
      .sort({ codigo: 1 })
      .exec();
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

  //+++++++++++++++SEND EMAIL
  async sendConfirmEmail(paymentOrder: PaymentOrder, product) {
    try {
      //const testAccount = await this.nodemailer.createTestAccount();
      console.log(paymentOrder);
      // create reusable transporter object using the default SMTP transport
      const transporter = transporterNodemailerOnlypu();
      const date = new Date();
      return transporter.sendMail(
        {
          from: `"Pago / Celccar.com" <${configNodemailer.poviya.auth.user}>`, // sender address
          to: `${paymentOrder.Customer.email}`, // list of receivers
          subject: 'Celccar Billete Electrónico', // Subject line ES, EN
          html: templateConfirmPaymentCafecitoEs(
            `${paymentOrder.Customer?.name} ${paymentOrder.Customer?.lastname}`,
            paymentOrder.codeCollection,
            date.toLocaleDateString('en-US'),
            product,
            paymentOrder.quantity,
            `${paymentOrder.Money.iso} ${paymentOrder.amount}`,
            `${paymentOrder.Money.iso} ${paymentOrder.amountBalance}`,
          ), // html body
        },
        (error) => {
          if (error) {
            console.log('email no enviado');
            return false; //response.status(500).send(error.message);
          } else {
            console.log('Enviado');
            return true;
          }
        },
      );
    } catch (error) {}
  }
}
