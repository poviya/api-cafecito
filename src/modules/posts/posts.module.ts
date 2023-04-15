import { Module } from '@nestjs/common';
import { PostBookmarkModule } from './post-bookmark/post-bookmak.module';
import { PostMediaModule } from './post-media/post-media.module';
import { PostCategoryModule } from './post-category/post-category.module';
import { PostSalesUnitModule } from './post-sales-unit/post-sales-unit.module';

@Module({
  imports: [
    PostBookmarkModule,
    PostMediaModule,
    PostCategoryModule,
    PostSalesUnitModule,
  ],
  exports: [PostBookmarkModule, PostMediaModule, PostCategoryModule],
})
export class PostsModule {}
