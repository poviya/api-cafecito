import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostSchema } from './entities/post.entity';
import { PostMediaModule } from '../post-media/post-media.module';
import { UserModule } from 'src/modules/users/user/user.module';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostCategoryModule } from '../post-category/post-category.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
    forwardRef(() => PostMediaModule),
    forwardRef(() => PostCategoryModule),
    forwardRef(() => UserModule),
  ],
  exports: [MongooseModule, PostService],
})
export class PostModule {}
