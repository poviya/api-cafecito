import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountryModule } from 'src/modules/countries/country/country.module';
import { PostMediaModule } from 'src/modules/posts/post-media/post-media.module';
import { PostModule } from 'src/modules/posts/post/post.module';
import { User, UserSchema } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CountryModule,
    forwardRef(() => PostModule),
    forwardRef(() => PostMediaModule),
  ],
  exports: [MongooseModule, UserService],
})
export class UserModule {}
