import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Put,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/modules/posts/post-media/helpers';
import { CurrentUser } from 'src/modules/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id/parse-mongo-id.pipe';
import {
  UpdateCourseDto,
  FindAllCourseDto,
  FindAllDto,
  FindAllUserDto,
  FindAllUserMediaDto,
  UpdateStatusDto,
} from './dto/course.dto';
import { AuthUserDto } from 'src/modules/auth/dto/authUser.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: fileFilter,
    }),
  )
  async create(
    @Body() dataDTO: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: AuthUserDto,
  ) {
    if (!files) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    const createDto = JSON.parse(dataDTO.data);
    //createDto.User = await user;
    //this.adImageService.uploadFileMultiple(files);
    const res = this.courseService.create(createDto, files, user);
    // console.log(dataDTO);
    //console.log(files);
    return res;
  }

  @Put(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dataDto: UpdateCourseDto,
  ) {
    const res = this.courseService.update(id, dataDto);
    return res;
  }

  @Put('status/:id')
  updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dataDto: UpdateStatusDto,
  ) {
    const res = this.courseService.update(id, dataDto);
    return res;
  }

  // @Post('find-all-user')
  // findAllUser(@Body() dataDto: FindAllUserDto) {
  //   const res = this.courseService.findAllUser(dataDto);
  //   return res;
  // }

  @Post('find-all-user-media')
  findAllUserMedia(@Body() dataDto: FindAllUserMediaDto) {
    const res = this.courseService.findAllUserMedia(dataDto);
    return res;
  }

  @Post('find-all-courses')
  findAllPosts(@Body() dataDto: FindAllCourseDto) {
    const res = this.courseService.findAllPosts(dataDto);
    return res;
  }

  @Get(':id')
  findById(@Param('id', ParseMongoIdPipe) id: string) {
    const res = this.courseService.findById(id);
    return res;
  }

  @Get('slug/:slug')
  findOneSlug(@Param('slug') slug: string) {
    const res = this.courseService.findOneSlug(slug);
    return res;
  }

  @Post('search')
  findSearch(@Body() dataDto: any) {
    const res = this.courseService.findSearch(dataDto);
    return res;
  }

  //+++++++++++++++++++++++ view products
  @Post('/find-all')
  async findAll(
    @Query() paginationDto: any,
    @Body() createDto: FindAllDto,
  ): Promise<any> {
    const res = await this.courseService.findAll(createDto, paginationDto);
    return res;
  }

  @Post('/find-all-infinite')
  async findAllInfinite(
    @Query() paginationDto: any,
    @Body() createDto: any,
    @CurrentUser() user: any,
  ) {
    const res = await this.courseService.findAllInfinite(
      createDto,
      paginationDto,
    );
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/find-all-count')
  async findAllCount(@Body() createDto: any, @CurrentUser() user: any) {
    createDto.User = await user;
    const res = await this.courseService.findAllCounter(createDto);
    return res;
  }
  //+++++++++++++++++++++++ end view courses

  //+++++++++++++++++++++++ view user courses
  @UseGuards(JwtAuthGuard)
  @Post('/find-all-user')
  async findAllUser(
    @Query() paginationDto: any,
    @Body() createDto: FindAllUserDto,
    @CurrentUser() user: any,
  ): Promise<any> {
    const res = await this.courseService.findAllUser(
      createDto,
      paginationDto,
      user,
    );
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/find-all-user-infinite')
  async findAllUserInfinite(
    @Query() paginationDto: any,
    @Body() createDto: any,
    @CurrentUser() user: any,
  ) {
    const res = await this.courseService.findAllUserInfinite(
      createDto,
      paginationDto,
      user,
    );
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/find-all-user-count')
  async findAllUserCount(@Body() createDto: any, @CurrentUser() user: any) {
    createDto.User = await user;
    const res = await this.courseService.findAllUserCounter(createDto, user);
    return res;
  }
  //+++++++++++++++++++++++ end view user products

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.courseService.remove(id);
  }
}
