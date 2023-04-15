import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostCategoryService } from './post-category.service';
import { CreatePostCategoryDto, UpdatePostCategoryDto } from './dto';
import { PostCategory } from './entities/post-category.entity';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id/parse-mongo-id.pipe';

@Controller('post-category')
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Post()
  async create(@Body() createCatDto: CreatePostCategoryDto) {
    const res = await this.postCategoryService.create(createCatDto);
    return res;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() datosDto: UpdatePostCategoryDto,
  ) {
    const res = await this.postCategoryService.update(id, datosDto);
    return res;
  }

  @Get()
  findAll() {
    return this.postCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostCategory> {
    return this.postCategoryService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postCategoryService.remove(id);
  }

  @Post('/query')
  async findAllQuery(@Body() data: any) {
    const res = await this.postCategoryService.findAllQuery(data);
    return res;
  }
}
