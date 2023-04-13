import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Country } from 'src/modules/countries/country/entities/country.entity';

@Schema({ collection: 'suppliers', timestamps: true })
export class Supplier {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Country.name })
  Country: Country;

  @Prop() name: string;
  @Prop({ type: Object }) contactNames: string;
  @Prop() idenfication: string;
  @Prop({ type: Object }) phone: string;
  @Prop({ type: Object }) email: string;
  @Prop() address: string;
  @Prop({
    required: true,
    default: 'SPORADIC',
    enum: ['REGULAR', 'SPORADIC'],
  })
  type: string;
  // CONTROL
  @Prop() active: boolean;
  @Prop() edit: boolean;
  @Prop() delete: boolean;
  @Prop() updatedAt: Date;
  @Prop({ default: Date.now }) createdAt: Date;
}
export const SupplierSchema = SchemaFactory.createForClass(Supplier);
