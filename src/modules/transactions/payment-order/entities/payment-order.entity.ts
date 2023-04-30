import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Course } from 'src/modules/courses/course/entities/course.entity';
import { Customer } from 'src/modules/customers/customer/entities/customer.entity';
import { Money } from 'src/modules/moneys/money/entities/money.entity';
import { Posts } from 'src/modules/posts/post/entities/post.entity';

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
@Schema({ collection: 'payment-orders', timestamps: true })
export class PaymentOrder {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  Customer?: Customer;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Money.name })
  Money?: Money;
  @Prop({ required: false })
  amount: number;

  @Prop({ required: true }) codeCollection?: string;

  @Prop({ required: false }) quantity: number;
  @Prop({ required: false }) amountDiscount: number;
  @Prop({ required: false }) amountBalance: number;

  @Prop({ required: true, enum: ['CARD', 'CASH'], default: 'CARD' })
  paymentMethod?: string;
  @Prop({
    required: true,
    enum: ['SALE_PRODUCT', 'SALE_COURSE'],
    default: 'SALE_PRODUCT',
  })
  paymentType?: string;

  @Prop({ required: false, type: Object }) receipt?: object;
  @Prop({
    required: true,
    enum: [
      'PETITION',
      'PENDING',
      'PAYMENT',
      'CANCELED',
      'REVERTED',
      'DECLINE',
      'ERROR',
    ],
    default: 'PETITION',
  })
  status?: string;

  @Prop({ required: false, type: Object }) paymentDetails?: object;

  // other
  @Prop({ required: false }) note?: string;
  @Prop({ default: false }) production?: boolean;

  // control
  @Prop({ default: true }) active?: boolean;
  @Prop({ default: true }) edit?: boolean;
  @Prop({ default: true }) delete?: boolean;

  @Prop({ required: false }) updatedAt?: Date;
  @Prop({ required: true, default: Date.now }) createdAt?: Date;
}

const PaymentOrderSchema = SchemaFactory.createForClass(PaymentOrder);
export { PaymentOrderSchema };
