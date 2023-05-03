import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Money } from 'src/modules/moneys/money/entities/money.entity';
import { PostMedia } from 'src/modules/posts/post-media/entities/post-media.entity';
import { User } from 'src/modules/users/user/entities/user.entity';

@Schema({ collection: 'courses', timestamps: true })
export class Course {
  _id?: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: PostMedia.name }],
  })
  PostMedia?: PostMedia[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: PostMedia.name }],
  })
  Announcement?: PostMedia[];

  @Prop({ unique: true, trim: true }) slug?: string;
  @Prop({ unique: true, trim: true }) code?: string;
  @Prop() title?: string;
  @Prop() description?: string;
  @Prop({ required: false }) tags?: [string];
  @Prop({ type: Object }) content?: object;
  @Prop() purposes?: string;
  @Prop() benefits?: string;
  @Prop() whoIsItFor?: string;
  @Prop() startDate?: string;
  @Prop() duration?: string;
  @Prop() schedule?: string;
  @Prop() modality?: string;
  @Prop() certifiedHours?: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Money.name })
  Money?: Money;
  @Prop() price?: string;

  @Prop({
    required: true,
    default: 'ACTIVE',
    enum: ['ACTIVE', 'SUSPENDED', 'EXPIRED'],
  })
  status?: string;

  @Prop({ required: true, default: true }) comment?: boolean;
  @Prop({ required: true, default: 0 }) likes?: number;
  @Prop({ required: true, default: 0 }) bookmarkes?: number;
  @Prop({ required: false }) search?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  User?: User;

  // CONTROL
  @Prop() active: boolean;
  @Prop() edit: boolean;
  @Prop() delete: boolean;
  @Prop() updatedAt: Date;
  @Prop({ default: Date.now }) createdAt: Date;
}

const CourseSchema = SchemaFactory.createForClass(Course);
CourseSchema.index({ title: 'text', tags: 'text', search: 'text' });
export { CourseSchema };
