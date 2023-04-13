import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostAdCategoryController } from './post-ad-category.controller';
import { PostAdCategoryService } from './post-ad-category.service';
import {
  PostAdCategory,
  PostAdCategorySchema,
} from './entities/post-ad-category.entity';
import { CountryModule } from 'src/modules/countries/country/country.module';

@Module({
  controllers: [PostAdCategoryController],
  providers: [PostAdCategoryService],
  imports: [
    MongooseModule.forFeature([
      { name: PostAdCategory.name, schema: PostAdCategorySchema },
    ]),
    CountryModule,
  ],
  exports: [MongooseModule],
})
export class PostAdCategoryModule {}
