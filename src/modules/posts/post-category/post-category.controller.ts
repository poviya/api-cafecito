import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PostCategoryService } from './post-category.service';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';
import { PostCategory } from './entities/post-category.entity';

@Controller('post-category')
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Post()
  async create(@Body() createCatDto: CreatePostCategoryDto) {
    const res = await this.postCategoryService.create(createCatDto);
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

  @Put(':id')
  async update(@Param('id') id: any, @Body() datosDTO: any) {
    const res = await this.postCategoryService.update(id, datosDTO);
    return res;
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
