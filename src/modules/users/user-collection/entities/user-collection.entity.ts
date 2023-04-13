import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Money } from 'src/modules/moneys/money/entities/money.entity';
import { User } from '../../user/entities/user.entity';

@Schema({ collection: 'user-collections', timestamps: true })
export class UserCollection {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  User: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Money.name })
  Money: string;

  @Prop({ type: Number, default: 0 }) targeAmount: number;
  @Prop({ type: Number, default: 0 }) currentAmount: number;
  @Prop({ type: Number, default: 0 }) incomeAmount: number;
  @Prop({ type: Number, default: 0 }) expenseAmount: number;

  @Prop({
    required: false,
    default: 'ACTIVE',
    enum: ['ACTIVE', 'SUSPENDED', 'INACTIVE'],
  })
  status?: string;

  //@Prop({ required: false, type: Object }) descriptions: string;
  // CONTROL
  @Prop({ default: false }) active?: boolean;
  @Prop({ default: false }) edit?: boolean;
  @Prop({ default: false }) delete?: boolean;

  @Prop({ required: false }) updatedAt?: Date;
  @Prop({ required: false, default: Date.now }) createdAt?: Date;
}

export const UserCollectionSchema =
  SchemaFactory.createForClass(UserCollection);
