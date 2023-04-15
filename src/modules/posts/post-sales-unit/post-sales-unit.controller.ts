import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostSalesUnitService } from './post-sales-unit.service';
import { CreatePostSalesUnitDto, UpdatePostSalesUnitDto } from './dto';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id/parse-mongo-id.pipe';
import { PostSalesUnit } from './entities/post-sales-unit.entity';

@Controller('post-sales-unit')
export class PostSalesUnitController {
  constructor(private readonly postSalesUniService: PostSalesUnitService) {}

  @Post()
  async create(@Body() createCatDto: CreatePostSalesUnitDto) {
    const res = await this.postSalesUniService.create(createCatDto);
    return res;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() datosDto: UpdatePostSalesUnitDto,
  ) {
    const res = await this.postSalesUniService.update(id, datosDto);
    return res;
  }

  @Get()
  findAll() {
    return this.postSalesUniService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostSalesUnit> {
    return this.postSalesUniService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postSalesUniService.remove(id);
  }

  @Post('/query')
  async findAllQuery(@Body() data: any) {
    const res = await this.postSalesUniService.findAllQuery(data);
    return res;
  }
}
