import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/user/entities/user.entity';
import { PostMedia } from 'src/modules/posts/post-media/entities/post-media.entity';
import { Money } from 'src/modules/moneys/money/entities/money.entity';
import { PostCategory } from '../../post-category/entities/post-category.entity';
import { PostSalesUnit } from '../../post-sales-unit/entities/post-sales-unit.entity';

@Schema({ collection: 'posts', timestamps: true })
export class Posts {
  /***************************************************** GLOBAL */

  _id?: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostMedia' }],
  })
  PostMedia?: PostMedia[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  Bookmark?: User[];

  @Prop({ required: true }) code?: string;
  @Prop({ required: true }) title?: string;
  @Prop({ required: true, unique: true }) slug?: string;
  @Prop({ required: true, type: String }) description?: string;
  @Prop({ required: false }) tags?: [string];
  @Prop({
    required: true,
    default: 'ACTIVE',
    enum: ['ACTIVE', 'SUSPENDED', 'EXPIRED'],
  })
  status?: string;

  @Prop({
    required: true,
    default: 'ARTICLE',
    enum: ['ARTICLE', 'BLOG'],
  })
  type?: string;

  @Prop({
    required: true,
    default: 'GR',
    enum: ['GR', 'KG'],
  })
  weight?: string;
  @Prop({ required: true, default: 0 }) weightAmount?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  User?: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: PostSalesUnit.name })
  PostSalesUnit?: PostSalesUnit;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: PostCategory.name })
  PostCategory?: PostCategory;

  @Prop({ required: true, default: 0 }) price?: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Money.name })
  Money?: Money;

  /*************************************************** ARTICLE */
  @Prop({ required: true, default: 0 }) stockLimit?: number;
  @Prop({ required: true, default: 0 }) stockCurrency?: number;
  @Prop({ required: true, default: 0 }) stockOrders?: number;

  @Prop({ required: true, default: 0 }) priceBuy?: number;
  @Prop({ required: true, default: 0 }) priceSale?: number;

  @Prop() eventDate?: string;

  @Prop({ required: true, default: true }) comment?: boolean;
  @Prop({ required: true, default: 0 }) likes?: number;
  @Prop({ required: true, default: 0 }) bookmarkes?: number;
  @Prop({ required: false }) search?: string;

  @Prop({ default: true }) active?: boolean;
  @Prop({ default: true }) edit?: boolean;
  @Prop({ default: true }) delete?: boolean;
  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt?: Date;
}

const PostSchema = SchemaFactory.createForClass(Posts);
PostSchema.index({ title: 'text', tags: 'text', search: 'text' });
export { PostSchema };
