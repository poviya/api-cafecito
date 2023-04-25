import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaymentOrder } from './entities/payment-order.entity';
import { Posts } from 'src/modules/posts/post/entities/post.entity';

@Injectable()
export class PaymentOrderService {
  constructor(
    @InjectModel(PaymentOrder.name)
    private readonly paymentOrderModel: Model<PaymentOrder>,
    @InjectModel(Posts.name)
    private readonly PostModel: Model<Posts>,
  ) {}

  async createProduct(dataDto: any): Promise<any> {
    const data = {
      Post: dataDto.Post,
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

  async edit(ID: string, datosDTO: any): Promise<any> {
    const res = await this.paymentOrderModel.updateOne({ _id: ID }, datosDTO, {
      new: true,
    });
    return res;
  }

  async transaction(dataDto: any): Promise<any> {
    if (dataDto.receipt.decision == 'ACCEPT') {
      const today = new Date();
      let sumDate = 0;
      console.log(today);
      if (dataDto.dataPaymentOder.Post.expirationDate > today) {
        sumDate = this.sumDaysToDate(
          dataDto.dataPaymentOder.AdProduct.days,
          dataDto.dataPaymentOder.Post.expirationDate,
        );
        console.log(new Date(dataDto.dataPaymentOder.Post.expirationDate));
      } else {
        console.log(dataDto.dataPaymentOder.AdProduct.days);
        sumDate = this.sumDaysToDate(
          dataDto.dataPaymentOder.AdProduct.days,
          today,
        );
        console.log(today);
      }

      const publishedCount =
        Number(dataDto.dataPaymentOder.Post.publishedCount) + 1;

      const dataDtoPost = {
        expirationDate: sumDate,
        published: true,
        status: 'ACTIVE',
        plan: dataDto.dataPaymentOder.AdProduct.type,
        publishedCount: publishedCount,
        planAt: new Date(),
        publishedAt: new Date(),
      };
      console.log(dataDtoPost);
      const resAd = await this.PostModel.updateOne(
        { _id: dataDto.dataPaymentOder.Post._id },
        dataDtoPost,
        {
          new: true,
        },
      );

      const datosDTOPaymentOrder = {
        status: 'PAYMENT',
        receipt: dataDto.receipt,
      };

      const resPaymentOrder = await this.paymentOrderModel.updateOne(
        { _id: dataDto.dataPaymentOder._id },
        datosDTOPaymentOrder,
        {
          new: true,
        },
      );

      return resPaymentOrder;
    } else if (dataDto.receipt.decision == 'CANCELED') {
      const datosDTOPaymentOrder = {
        status: 'CANCELED',
        receipt: dataDto.receipt,
      };

      const resPaymentOrder = await this.paymentOrderModel.updateOne(
        { _id: dataDto.dataPaymentOder._id },
        datosDTOPaymentOrder,
        {
          new: true,
        },
      );

      const publishedCount =
        Number(dataDto.dataPaymentOder.Post.publishedCount) - 1;

      const dataDtoPost = {
        expirationDate: 0,
        published: false,
        status: 'ACTIVE',
        plan: 0,
        publishedCount: publishedCount,
        planAt: new Date(),
        publishedAt: null,
      };
      console.log(dataDtoPost);
      const resAd = await this.PostModel.updateOne(
        { _id: dataDto.dataPaymentOder.Post._id },
        dataDtoPost,
        {
          new: true,
        },
      );

      return resPaymentOrder;
    } else if (dataDto.receipt.decision == 'REVERTED') {
      const datosDTOPaymentOrder = {
        status: 'REVERTED',
        receipt: dataDto.receipt,
      };

      const resPaymentOrder = await this.paymentOrderModel.updateOne(
        { _id: dataDto.dataPaymentOder._id },
        datosDTOPaymentOrder,
        {
          new: true,
        },
      );

      const publishedCount =
        Number(dataDto.dataPaymentOder.Post.publishedCount) - 1;

      const dataDtoPost = {
        expirationDate: 0,
        published: false,
        status: 'ACTIVE',
        plan: 0,
        publishedCount: publishedCount,
        planAt: new Date(),
        publishedAt: null,
      };
      console.log(dataDtoPost);
      const resAd = await this.PostModel.updateOne(
        { _id: dataDto.dataPaymentOder.Post._id },
        dataDtoPost,
        {
          new: true,
        },
      );

      return resPaymentOrder;
    } else if (dataDto.receipt.decision == 'ERROR') {
      const datosDTOPaymentOrder = {
        status: 'ERROR',
        receipt: dataDto.receipt,
      };

      const resPaymentOrder = await this.paymentOrderModel.updateOne(
        { _id: dataDto.dataPaymentOder._id },
        datosDTOPaymentOrder,
        {
          new: true,
        },
      );
      return resPaymentOrder;
    }
    /*
        suma = hoy.getTime() + semanaEnMilisegundos; //getTime devuelve milisegundos de esa fecha
        let fechaDentroDeUnaSemana = new Date(suma);
        let hoy = new Date();
        let mañana = new Date(hoy.getTime() + 1000 * 60 * 60 * 24); new Date(hoy.getTime() + 1000 * 60 * 60 * 24); //Calcular fecha a futuro para ejemplificar

        const res = await this.paymentOrderModel.updateOne(
            { _id: dataDto.PaymentOrder },
            dataDto,
            {
            new: true,
            },
        );

        return res;
        */
  }

  async findAll(): Promise<PaymentOrder[]> {
    return this.paymentOrderModel.find().sort({ codigo: 1 }).exec();
  }

  async findOneCodeCollection(codeCollection: string): Promise<PaymentOrder> {
    const res = this.paymentOrderModel
      .findOne({
        codeCollection: codeCollection,
      })
      .populate('Site')
      .populate('Card')
      .populate('MoneyPay')
      .populate('Money')
      .populate('MoneyTransaction')
      .populate('Sender')
      .exec();
    return res;
  }

  async findOne(ID: string) {
    let res: any;

    if (isValidObjectId(ID)) {
      res = await this.paymentOrderModel
        .findById(ID)
        .populate('Country')
        .populate('Post')
        .populate('Card')
        .populate('MoneyPay')
        .populate('Money')
        .populate('MoneyTransaction')
        .populate('Sender')
        .exec();
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
}
