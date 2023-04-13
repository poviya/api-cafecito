import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CityZone,
  CityZoneSchema,
} from '../countries/city-zone/entities/city-zone.entity';
import {
  CountryState,
  CountryStateSchema,
} from '../countries/country-state/entities/country-state.entity';
import {
  StateCity,
  StateCitySchema,
} from '../countries/state-city/entities/state-city.entity';
import {
  PostBookmark,
  PostBookmarkSchema,
} from '../posts/post-bookmark/entities/post-bookmark.entity';
import {
  PostMedia,
  PostMediaSchema,
} from '../posts/post-media/entities/post-media.entity';
import { Posts, PostSchema } from '../posts/post/entities/post.entity';
import { User, UserSchema } from '../users/user/entities/user.entity';

//import { TelegrafUpdate } from './telegram/telegraf.update';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema },
      { name: PostMedia.name, schema: PostMediaSchema },
      { name: PostBookmark.name, schema: PostBookmarkSchema },
      { name: CountryState.name, schema: CountryStateSchema },
      { name: StateCity.name, schema: StateCitySchema },
      { name: CityZone.name, schema: CityZoneSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [],
  providers: [,/*TelegrafUpdate, PostAdService, PostMediaService */],
})
export class NotificationModule {}
