import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ collection: 'money-converts' })
//@Schema({ timestamps: true })
export class MoneyConvert {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Money' })
  MoneyOf: string;

  @Prop({ required: true }) amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Money' })
  MoneyA: string;

  @Prop({ required: true }) amountBuy: number;
  @Prop({ required: true }) amountSale: number;

  // CONTROL
  @Prop({ default: true }) active: boolean;
  @Prop({ default: true }) edit: boolean;
  @Prop({ default: true }) delete: boolean;

  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
}

export const MoneyConvertSchema = SchemaFactory.createForClass(MoneyConvert);
