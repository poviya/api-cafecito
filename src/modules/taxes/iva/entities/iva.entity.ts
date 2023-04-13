import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Country } from 'src/modules/countries/country/entities/country.entity';

@Schema({ collection: 'ivas', timestamps: true })
export class Iva {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Country.name })
  Country: Country;

  @Prop() taxRate: number;
  // CONTROL
  @Prop() active: boolean;
  @Prop() edit: boolean;
  @Prop() delete: boolean;
  @Prop() updatedAt: Date;
  @Prop({ default: Date.now }) createdAt: Date;
}
export const IvaSchema = SchemaFactory.createForClass(Iva);
