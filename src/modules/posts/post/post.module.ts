import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostSchema } from './entities/post.entity';
import { PostMediaModule } from '../post-media/post-media.module';
import { PostMediaService } from '../post-media/post-media.service';
import { UserModule } from 'src/modules/users/user/user.module';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  controllers: [PostController],
  providers: [PostMediaService, PostService],
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
    forwardRef(() => PostMediaModule),
    forwardRef(() => UserModule),
    forwardRef(() => UserModule),
  ],
  exports: [MongooseModule],
})
export class PostModule {}
