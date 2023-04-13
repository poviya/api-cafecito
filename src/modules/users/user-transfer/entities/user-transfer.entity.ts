import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Money } from 'src/modules/moneys/money/entities/money.entity';
import { User } from '../../user/entities/user.entity';

@Schema({ collection: 'user-transfers', timestamps: true })
export class UserTransfer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  User: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Money.name })
  Money: string;

  @Prop({ required: false, type: Object }) details?: object;

  @Prop({
    required: false,
    default: 'PAYPAL',
    enum: ['PAYPAL', 'LINK_PAY'],
  })
  type?: string;

  @Prop({
    required: false,
    default: 'NOT_VERIFIED',
    enum: ['NOT_VERIFIED', 'VERIFIED', 'REFUSED'],
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

export const UserTransferSchema = SchemaFactory.createForClass(UserTransfer);
