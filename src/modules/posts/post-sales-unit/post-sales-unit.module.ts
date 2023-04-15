import { Module } from '@nestjs/common';
import { PostSalesUnitService } from './post-sales-unit.service';
import { PostSalesUnitController } from './post-sales-unit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PostSalesUnit,
  PostSalesUnitSchema,
} from './entities/post-sales-unit.entity';

@Module({
  controllers: [PostSalesUnitController],
  providers: [PostSalesUnitService],
  imports: [
    MongooseModule.forFeature([
      { name: PostSalesUnit.name, schema: PostSalesUnitSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class PostSalesUnitModule {}
