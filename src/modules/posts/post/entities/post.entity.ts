import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { StateCity } from 'src/modules/countries/state-city/entities/state-city.entity';
import { CityZone } from 'src/modules/countries/city-zone/entities/city-zone.entity';
import { Country } from 'src/modules/countries/country/entities/country.entity';
import { CountryState } from 'src/modules/countries/country-state/entities/country-state.entity';
import { User } from 'src/modules/users/user/entities/user.entity';
import { PostMedia } from 'src/modules/posts/post-media/entities/post-media.entity';
import { PostAdCategory } from '../../post-ad-category/entities/post-ad-category.entity';
import { Money } from 'src/modules/moneys/money/entities/money.entity';

@Schema({ collection: 'posts', timestamps: true })
export class Posts {
  /***************************************************** GLOBAL */

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostMedia' }],
  })
  PostMedia?: PostMedia[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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
    enum: ['ARTICLE'],
  })
  type?: string;

  @Prop({ required: true, default: true }) comment?: boolean;
  @Prop({ required: true, default: 0 }) likes?: number;
  @Prop({ required: true, default: 0 }) bookmarkes?: number;
  @Prop({ required: false }) search?: string;

  @Prop({ default: true }) active?: boolean;
  @Prop({ default: true }) edit?: boolean;
  @Prop({ default: true }) delete?: boolean;

  @Prop({ required: true, default: Date.now }) createdAt?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  User?: User;

  /*********************************************** ADS */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    localField: 'Country',
    foreignField: '_id',
    justOne: true,
  })
  Country?: Country;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CountryState' })
  CountryState?: CountryState;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'StateCity' })
  StateCity?: StateCity;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CityZone' })
  CityZone?: CityZone;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PostAdCategory' })
  PostAdCategory?: PostAdCategory;

  @Prop({ required: false }) age?: string;
  @Prop({ required: false }) address?: string;
  @Prop({ required: false }) postalCode?: string;
  @Prop({ required: false }) zone?: string;
  @Prop({ required: false }) phonePrefix?: string;
  @Prop({ required: false }) phone?: string;
  @Prop({ default: false }) whatsapp?: boolean;
  @Prop({ required: false }) telegram?: string;
  @Prop({ required: true, default: 0 }) phoneClick?: number;
  @Prop({ required: true, default: 0 }) whatsappClick?: number;
  @Prop({ required: true, default: 0 }) telegramClick?: number;
  @Prop({ required: true, default: 0 }) totalClick?: number;
  @Prop({ required: true, default: 0 }) plan?: number; // 0: free, 1: top, 2: top_premium

  //@Prop({ type: mongoose.Schema.Types.Array }) AdImages: string[];

  @Prop({ required: false }) publishedAt?: Date;
  @Prop({ required: true, default: false }) published?: boolean;
  @Prop({ required: true, default: 0 }) publishedCount?: number;
  @Prop({ required: false }) expirationDate?: number;

  @Prop({ required: false }) planAt?: Date;
  @Prop({ required: false }) updatedAt?: Date;

  /*************************************************** POST */
  @Prop({
    required: true,
    default: 'PAYMENT',
    enum: ['PAYMENT', 'SUBSCRIBERS', 'FREE'],
  })
  typeView?: string;

  @Prop({ required: true, default: 0 }) price?: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Money.name })
  Money?: Money;

  /*************************************************** ARTICLE */
  @Prop({ required: true, default: 0 }) stockLimit?: number;
  @Prop({ required: true, default: 0 }) stockCurrency?: number;
  @Prop({ required: true, default: 0 }) stockOrders?: number;

  @Prop({ required: true, default: 0 }) priceBuy?: number;
  @Prop({ required: true, default: 0 }) priceSale?: number;
}

const PostSchema = SchemaFactory.createForClass(Posts);
PostSchema.index({ title: 'text', tags: 'text', search: 'text' });
export { PostSchema };
