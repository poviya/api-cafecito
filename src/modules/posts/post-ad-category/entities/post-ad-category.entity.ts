import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Country } from 'src/modules/countries/country/entities/country.entity';

@Schema({ collection: 'post-ad-categories', timestamps: true })
export class PostAdCategory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Country.name })
  Country: string;

  @Prop({ required: true }) name: string;
  @Prop({ required: false }) icon: string;
  @Prop({ required: true }) slug: string;
  @Prop({ required: true }) type:
    | 'SCORTS'
    | 'ESCORTS_MASCULINOS'
    | 'MASAJES'
    | 'TRAVESTIS'
    | 'ENCUENTROS';
  //@Prop({ required: true }) order: string;

  // SCORTS, MASAJES, SCORTS_MASCULINOS,
  // CONTROL
  @Prop({ default: true }) active: boolean;
  @Prop({ default: true }) edit: boolean;
  @Prop({ default: true }) delete: boolean;
  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
}

export const PostAdCategorySchema =
  SchemaFactory.createForClass(PostAdCategory);
