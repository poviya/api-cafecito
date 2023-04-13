import { Module } from '@nestjs/common';
import { PostAdCategoryModule } from './post-ad-category/post-ad-category.module';
import { PostBookmarkModule } from './post-bookmark/post-bookmak.module';
import { PostMediaModule } from './post-media/post-media.module';

@Module({
  imports: [PostAdCategoryModule, PostBookmarkModule, PostMediaModule],
  exports: [PostAdCategoryModule, PostBookmarkModule, PostMediaModule],
})
export class PostsModule {}
