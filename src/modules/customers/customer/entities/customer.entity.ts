import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Country } from 'src/modules/countries/country/entities/country.entity';
import { User } from 'src/modules/users/user/entities/user.entity';

@Schema({ collection: 'customers', timestamps: true })
export class Customer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  User?: User;
  //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Country.name })
  Country?: Country;

  //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: CountryState.name })
  //CountryState: string;

  @Prop() name: string;
  @Prop({ required: false }) lastname: string;
  @Prop() contactName: string;
  @Prop() contactPerson: string;
  @Prop() idenfication: string;
  @Prop({ required: false }) phonePrefix: string;
  @Prop({ required: false, index: true }) phone: string;
  @Prop({ index: true }) email: string;
  @Prop() address: string;
  @Prop({ required: false }) city: string;
  @Prop({ required: false }) state: string;
  @Prop({ required: false }) country: string;
  @Prop({ required: false }) postalCode: string;

  @Prop({
    required: true,
    default: 'PERSON',
    enum: ['PERSON', 'COMPANY'],
  })
  entity: string;

  @Prop({
    required: true,
    default: 'SPORADIC',
    enum: ['REGULAR', 'SPORADIC'],
  })
  type: string;
  @Prop({ default: false }) days: number;
  @Prop({ default: false }) taxExempt: boolean;
  @Prop() note: string;
  // CONTROL
  @Prop() active: boolean;
  @Prop() edit: boolean;
  @Prop() delete: boolean;
  @Prop() updatedAt: Date;
  @Prop({ default: Date.now }) createdAt: Date;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
