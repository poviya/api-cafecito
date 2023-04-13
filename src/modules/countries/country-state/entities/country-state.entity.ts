import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Country } from '../../country/entities/country.entity';

@Schema({ collection: 'country-states', timestamps: true })
export class CountryState {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Country.name })
  Country: string;

  @Prop({ required: true }) name: string;
  @Prop({ required: true, trim: true }) slug: string;

  // CONTROL
  @Prop({ default: true }) active: boolean;
  @Prop({ default: true }) edit: boolean;
  @Prop({ default: true }) delete: boolean;
  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
}

export const CountryStateSchema = SchemaFactory.createForClass(CountryState);
