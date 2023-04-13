import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { CountryState } from '../../country-state/entities/country-state.entity';
import { Country } from '../../country/entities/country.entity';

@Schema({ collection: 'state-cities', timestamps: true })
export class StateCity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Country.name })
  Country: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CountryState.name })
  CountryState: string;

  @Prop({ required: true }) name: string;
  @Prop({ required: true, trim: true }) slug: string;

  // CONTROL
  @Prop({ default: true }) active: boolean;
  @Prop({ default: true }) edit: boolean;
  @Prop({ default: true }) delete: boolean;
  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
}

export const StateCitySchema = SchemaFactory.createForClass(StateCity);
