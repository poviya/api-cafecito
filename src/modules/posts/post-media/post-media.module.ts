import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/user/entities/user.entity';
import { UserModule } from 'src/modules/users/user/user.module';
import { PostModule } from '../post/post.module';
import { PostMedia, PostMediaSchema } from './entities/post-media.entity';
import { PostMediaController } from './post-media.controller';
import { PostMediaService } from './post-media.service';
import { AmazonStorageService } from './s3/amazonStorageService';
import { UtilsMediaService } from './utils/snapshot';
import { CloudflareService } from './s3/cloudflareService';

@Module({
  controllers: [PostMediaController],
  providers: [
    PostMediaService,
    AmazonStorageService,
    CloudflareService,
    UtilsMediaService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: PostMedia.name, schema: PostMediaSchema },
    ]),
    forwardRef(() => PostModule),
    forwardRef(() => UserModule),
  ],
  exports: [
    PostMediaService,
    AmazonStorageService,
    MongooseModule,
    UtilsMediaService,
    CloudflareService,
  ],
})
export class PostMediaModule {}
