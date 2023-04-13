import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Country } from 'src/modules/countries/country/entities/country.entity';
import { User } from '../../user/entities/user.entity';

export class Personal {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Country.name })
  Country: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  User: string;

  @Prop({ required: false }) name: string;
  @Prop({ required: false }) lastname: string;
  @Prop({ required: false }) birthYear: string;
  @Prop({ required: false }) birthMonth: string;
  @Prop({ required: false }) birthDay: string;
  @Prop({ required: false }) adress: string;
  @Prop({ required: false }) postalCode: string;

  @Prop({
    required: true,
    default: 'NOT_VERIFIED',
    enum: ['NOT_VERIFIED', 'VERIFIED', 'REFUSED'],
  })
  status: string;

  //@Prop({ required: false, type: Object }) descriptions: string;
  // CONTROL
  @Prop({ default: true }) active: boolean;
  @Prop({ default: true }) edit: boolean;
  @Prop({ default: true }) delete: boolean;

  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
}

export const PersonalSchema = SchemaFactory.createForClass(Personal);
