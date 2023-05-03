import { Module, forwardRef } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './entities/course.entity';
import { PostMediaModule } from 'src/modules/posts/post-media/post-media.module';
import { UserModule } from 'src/modules/users/user/user.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    forwardRef(() => PostMediaModule),
    forwardRef(() => UserModule),
  ],
  exports: [MongooseModule, CourseService],
})
export class CourseModule {}
