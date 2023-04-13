import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/user/entities/user.entity';
import { UserModule } from 'src/modules/users/user/user.module';
import { Posts, PostSchema } from '../post/entities/post.entity';
import { PostModule } from '../post/post.module';
import {
  PostBookmark,
  PostBookmarkSchema,
} from './entities/post-bookmark.entity';
import { PostBookmarkController } from './post-bookmark.controller';
import { PostBookmarkService } from './post-bookmark.service';

@Module({
  controllers: [PostBookmarkController],
  providers: [PostBookmarkService],
  imports: [
    MongooseModule.forFeature([
      { name: PostBookmark.name, schema: PostBookmarkSchema },
    ]),
    UserModule,
    PostModule,
  ],
  exports: [MongooseModule, PostBookmarkService],
})
export class PostBookmarkModule {}
