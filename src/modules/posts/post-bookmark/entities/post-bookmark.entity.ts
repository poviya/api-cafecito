import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/user/entities/user.entity';
import { Posts } from 'src/modules/posts/post/entities/post.entity';

@Schema({ collection: 'post-bookmarks', timestamps: true })
export class PostBookmark {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  User: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' })
  Post: Posts;

  @Prop({ default: false }) like: boolean;

  // CONTROL
  @Prop({ default: true }) active: boolean;
  @Prop({ default: true }) edit: boolean;
  @Prop({ default: true }) delete: boolean;

  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
}

export const PostBookmarkSchema = SchemaFactory.createForClass(PostBookmark);
