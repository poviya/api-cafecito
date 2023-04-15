import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'post-sales-unit', timestamps: true })
export class PostSalesUnit {
  @Prop({ required: true }) name: string;
  @Prop({ required: false }) icon: string;
  @Prop({ required: true }) slug: string;

  @Prop({ default: true }) active: boolean;
  @Prop({ default: true }) edit: boolean;
  @Prop({ default: true }) delete: boolean;
  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
}

export const PostSalesUnitSchema = SchemaFactory.createForClass(PostSalesUnit);
