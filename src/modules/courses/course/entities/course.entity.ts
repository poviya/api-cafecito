import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Money } from 'src/modules/moneys/money/entities/money.entity';

@Schema({ collection: 'courses', timestamps: true })
export class Course {
  @Prop({ unique: true, trim: true }) slug?: string;
  @Prop({ unique: true, trim: true }) code?: string;
  @Prop() title?: string;
  @Prop() description?: string;
  @Prop({ type: Object }) content?: object;
  @Prop() startDate?: string;
  @Prop() duration?: string;
  @Prop() schedule?: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Money.name })
  Money?: Money;
  @Prop() price?: string;
  // CONTROL
  @Prop() active: boolean;
  @Prop() edit: boolean;
  @Prop() delete: boolean;
  @Prop() updatedAt: Date;
  @Prop({ default: Date.now }) createdAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
