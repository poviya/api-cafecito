import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PostAdCategory } from './entities/post-ad-category.entity';
import { PostAdCategoryService } from './post-ad-category.service';

//@UseGuards(JwtAuthGuard)
@Controller('post-ad-category')
export class PostAdCategoryController {
  constructor(private readonly adCategoryService: PostAdCategoryService) {}

  @Post()
  async create(@Res() res: any, @Body() createCatDto: any) {
    const object = await this.adCategoryService.create(createCatDto);
    return res.status(HttpStatus.OK).json(object);
  }

  @Get()
  findAll() {
    return this.adCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostAdCategory> {
    return this.adCategoryService.findOne(id);
  }

  @Put(':id')
  async update(@Res() res: any, @Param('id') id: any, @Body() datosDTO: any) {
    const objeto = await this.adCategoryService.update(id, datosDTO);
    if (!objeto) throw new NotFoundException('No exists!');
    return res.status(HttpStatus.OK).json(objeto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adCategoryService.remove(id);
  }

  @Post('/query')
  async findAllQuery(@Res() res: any, @Body() data: any) {
    const object = await this.adCategoryService.findAllQuery(data);
    return res.status(HttpStatus.OK).json(object);
  }

  @Post('/country')
  async findAllCountry(@Body() data: any) {
    const res = await this.adCategoryService.findAllCountry(data);
    return res;
  }
}
