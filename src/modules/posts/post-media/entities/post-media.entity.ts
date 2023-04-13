import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/users/user/entities/user.entity';
import { Posts } from 'src/modules/posts/post/entities/post.entity';

@Schema({ collection: 'post-medias', timestamps: true })
export class PostMedia {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  User: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' })
  Post: Posts;

  @Prop({ required: false }) urlSmall: string;
  @Prop({ required: false }) keySmall: string;
  @Prop({ required: false }) urlSnapshot: string;
  @Prop({ required: false }) keySnapshot: string;
  @Prop({ required: false }) typeSnapshot: string;
  @Prop({ required: false }) extensionSnapshot: string;

  @Prop({ required: false }) url: string;
  @Prop({ required: false }) key: string;
  @Prop({ required: false }) type: string;
  @Prop({ required: false }) extension: string;

  @Prop({
    required: false,
    enum: ['AD', 'POST', 'PROFILE', 'DOCUMENT'],
    default: 'POST',
  })
  category: string;

  // CONTROL
  @Prop({ default: true }) active: boolean;
  @Prop({ default: true }) edit: boolean;
  @Prop({ default: true }) delete: boolean;
  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
}

export const PostMediaSchema = SchemaFactory.createForClass(PostMedia);
