import { Module } from '@nestjs/common';
import { PostCategoryService } from './post-category.service';
import { PostCategoryController } from './post-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PostCategory,
  PostCategorySchema,
} from './entities/post-category.entity';

@Module({
  controllers: [PostCategoryController],
  providers: [PostCategoryService],
  imports: [
    MongooseModule.forFeature([
      { name: PostCategory.name, schema: PostCategorySchema },
    ]),
  ],
  exports: [MongooseModule, PostCategoryService],
})
export class PostCategoryModule {}
