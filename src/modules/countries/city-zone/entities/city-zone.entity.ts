import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { StateCity } from '../../state-city/entities/state-city.entity';
import { Country } from '../../country/entities/country.entity';
import { CountryState } from '../../country-state/entities/country-state.entity';

@Schema({ collection: 'city-zones' })
export class CityZone {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Country.name })
  Country: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CountryState.name })
  CountryState: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: StateCity.name })
  StateCity: string;

  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) slug: string;

  // CONTROL
  @Prop({ default: true }) active: boolean;
  @Prop({ default: true }) edit: boolean;
  @Prop({ default: true }) delete: boolean;
  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
}

export const CityZoneSchema = SchemaFactory.createForClass(CityZone);
