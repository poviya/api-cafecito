import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, now } from 'mongoose';
import { Country } from 'src/modules/countries/country/entities/country.entity';
import { StateCity } from 'src/modules/countries/state-city/entities/state-city.entity';
import { PostMedia } from 'src/modules/posts/post-media/entities/post-media.entity';

@Schema({ collection: 'users' })
@Schema({ timestamps: true })
export class User {
  [x: string]: any;
  //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Suscription' })
  //Suscription: Suscription[];

  // @Prop() _id: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostMedia' }],
  })
  Cover: PostMedia[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostMedia' }],
  })
  Profile: PostMedia[];

  //@Prop({ required: false, unique: true }) slug: string;
  @Prop({ required: true, unique: true, trim: true }) username: string;
  @Prop({ required: true }) password: string;
  @Prop() email: string;
  @Prop({ default: false }) emailVerified: boolean;
  @Prop({ default: false }) codeVerified: number;

  @Prop() name: string;
  @Prop() lastname: string;
  @Prop({ required: false }) phonePrefix: string;
  @Prop({ required: false }) phone: string;
  @Prop({ default: true }) whatsapp: boolean;

  @Prop({
    required: true,
    default: 'MEN',
    enum: ['WOMAN', 'MEN'],
  })
  gender: string;

  @Prop() languages: string;
  @Prop() age: string;
  @Prop() interestedIn: string;
  @Prop() bodyType: string;
  @Prop() cpecifics: string;
  @Prop() ethnicity: string;
  @Prop() hair: string;
  @Prop() eyeColor: string;
  @Prop() subculture: string;
  @Prop({ required: false, type: Object }) interests: string;
  @Prop() bio: string;
  @Prop() location: string;
  @Prop() webPage: string;
  @Prop() listAmazon: string;

  // SOCKET
  @Prop({ default: true }) online: boolean;
  @Prop() socket: string;
  @Prop() notificationToken: string;

  // CONTROL
  @Prop({ default: true }) active: boolean;
  @Prop({ default: true }) edit: boolean;
  @Prop({ default: true }) delete: boolean;
  @Prop({ required: false }) updatedAt: Date;
  @Prop({ required: true, default: Date.now }) createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
