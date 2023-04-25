import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'countries', timestamps: true })
export class Country {
  @Prop() icon: string;
  @Prop() name: string;
  @Prop({ unique: true, trim: true }) slug: string;
  @Prop({ unique: true, trim: true }) code: string;
  @Prop() phonePrefix: string;
  @Prop() activeOnlypu: boolean;
  // CONTROL
  @Prop() active: boolean;
  @Prop() edit: boolean;
  @Prop() delete: boolean;
  @Prop() updatedAt: Date;
  @Prop({ default: Date.now }) createdAt: Date;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
