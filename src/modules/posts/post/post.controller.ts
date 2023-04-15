import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id/parse-mongo-id.pipe';
import { CurrentUser } from 'src/modules/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { fileFilter } from '../post-media/helpers';
import {
  AnalyzeHastagsDto,
  FindAllPostDto,
  FindAllUserDto,
  FindAllUserMediaDto,
  UpdatePostDto,
} from './dto/post.dto';
import { PostService } from './post.service';
import { AuthUserDto } from 'src/modules/auth/dto/authUser.dto';

@Controller('post')
export class PostController {
  postAdService: any;
  constructor(private readonly postService: PostService) {}

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
    @CurrentUser() user: any,
  ) {
    if (!files) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    const createDto = JSON.parse(dataDTO.data);
    //createDto.User = await user;
    //this.adImageService.uploadFileMultiple(files);
    const res = this.postService.create(createDto, files, user);
    // console.log(dataDTO);
    //console.log(files);
    return res;
  }

  @Put(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dataDto: UpdatePostDto,
  ) {
    const res = this.postService.update(id, dataDto);
    return res;
  }

  @Post('find-all-user')
  findAllUser(@Body() dataDto: FindAllUserDto) {
    const res = this.postService.findAllUser(dataDto);
    return res;
  }

  @Post('find-all-user-media')
  findAllUserMedia(@Body() dataDto: FindAllUserMediaDto) {
    const res = this.postService.findAllUserMedia(dataDto);
    return res;
  }

  @Post('find-all-posts')
  findAllPosts(@Body() dataDto: FindAllPostDto) {
    const res = this.postService.findAllPosts(dataDto);
    return res;
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    console.log(1);
    const res = this.postService.findOne(id);
    return res;
  }

  //hastags
  @Post('analyze-hastags')
  analyzeHastag(@Body() dataDto: AnalyzeHastagsDto) {
    const res = this.postService.splitChaing(dataDto.text);
    return res;
  }

  @Post('search')
  findSearch(@Body() dataDto: any) {
    const res = this.postService.findSearch(dataDto);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/find-all')
  async findAll(
    @Query() paginationDto: any,
    @Body() createDto: any,
    @CurrentUser() user: AuthUserDto,
  ): Promise<any> {
    const res = await this.postService.findAll(createDto, paginationDto);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/find-all-infinite')
  async findAllInfinite(
    @Query() paginationDto: any,
    @Body() createDto: any,
    @CurrentUser() user: any,
  ) {
    const res = await this.postService.findAllInfinite(
      createDto,
      paginationDto,
    );
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/find-all-count')
  async findAllCount(@Body() createDto: any, @CurrentUser() user: any) {
    createDto.User = await user;
    const res = await this.postService.findAllCounter(createDto);
    return res;
  }
}
