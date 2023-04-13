import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/current-user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/authUser.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreatePostBookmarkDto } from './dto/post-bookmark.dto';
import { PostBookmark } from './entities/post-bookmark.entity';

import { PostBookmarkService } from './post-bookmark.service';

@Controller('post-bookmark')
export class PostBookmarkController {
  constructor(private readonly postFavoriteService: PostBookmarkService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dataDto: CreatePostBookmarkDto,
    @CurrentUser() user: AuthUserDto,
  ) {
    const object = await this.postFavoriteService.create(dataDto, user);
    return object;
  }

  @Put('/:id')
  async edit(@Res() res: any, @Param('id') id: any, @Body() dataDto: any) {
    const object = await this.postFavoriteService.edit(id, dataDto);
    if (!object) throw new NotFoundException('does not exist!');
    return res.status(HttpStatus.OK).json(object);
  }

  @Get()
  async findAll(): Promise<PostBookmark[]> {
    return this.postFavoriteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostBookmark> {
    return this.postFavoriteService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.postFavoriteService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/find-all-user')
  async findAllUser(
    @Res() res: any,
    @Query() paginationDto: any,
    @Body() dataDto: any,
    @CurrentUser() user: any,
  ) {
    dataDto.User = await user;
    const object = await this.postFavoriteService.findAllUser(
      dataDto,
      paginationDto,
    );
    return res.status(HttpStatus.OK).json(object);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/find-all-user-infinite')
  async findAllUserInfinite(
    @Res() res: any,
    @Query() paginationDto: any,
    @Body() dataDto: any,
    @CurrentUser() user: any,
  ) {
    dataDto.User = await user;
    const object = await this.postFavoriteService.findAllUser(
      dataDto,
      paginationDto,
    );
    return res.status(HttpStatus.OK).json(object);
  }

  @Post('/find-one-user')
  async findOneUser(@Res() res: any, @Body() dataDto: any) {
    const object = await this.postFavoriteService.findOneUser(dataDto);
    return res.status(HttpStatus.OK).json(object);
    /*
    if (object) {
      return res.status(HttpStatus.OK).json({
        status: false,
        msg: 'does not exist!',
        data: object,
      });
    } else {
      return res.status(HttpStatus.OK).json({
        status: false,
        msg: 'does not exist!',
      });
    }*/
  }
}
