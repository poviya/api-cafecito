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
  Res,
} from '@nestjs/common';
import { MoneyConvert } from './entities/money-convert.entity';
import { MoneyConvertService } from './money-convert.service';

@Controller('money-convert')
export class MoneyConvertController {
  constructor(private readonly moneyConvertService: MoneyConvertService) {}

  @Post()
  async create(@Res() res: any, @Body() dataDto: any) {
    const object = await this.moneyConvertService.create(dataDto);
    if (!object) throw new NotFoundException('does not exist!');
    return res.status(HttpStatus.OK).json(object);
  }

  @Put('/:id')
  async edit(@Res() res: any, @Param('id') id: any, @Body() dataDto: any) {
    const object = await this.moneyConvertService.edit(id, dataDto);
    if (!object) throw new NotFoundException('does not exist!');
    return res.status(HttpStatus.OK).json(object);
  }

  @Get()
  async findAll(): Promise<MoneyConvert[]> {
    return this.moneyConvertService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MoneyConvert> {
    return this.moneyConvertService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.moneyConvertService.delete(id);
  }

  @Post('convert')
  async convert(@Res() res: any, @Body() dataDto: any) {
    const object = await this.moneyConvertService.convert(dataDto);
    if (!object) throw new NotFoundException('does not exist!');
    return res.status(HttpStatus.OK).json(object);
  }
}
