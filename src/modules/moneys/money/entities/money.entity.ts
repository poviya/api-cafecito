import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ collection: 'moneys', timestamps: true })
export class Money {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: string;
  @Prop({ required: true }) iso: string;
  @Prop({ required: true }) symbol: string;

  // CONTROL
  @Prop({ default: true }) active: boolean;
  @Prop({ default: true }) edit: boolean;
  @Prop({ default: true }) delete: boolean;

  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
}

export const MoneySchema = SchemaFactory.createForClass(Money);
