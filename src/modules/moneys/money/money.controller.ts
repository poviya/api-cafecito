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
import { Money } from './entities/money.entity';
import { MoneyService } from './money.service';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id/parse-mongo-id.pipe';

@Controller('money')
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {}

  @Post()
  async create(@Res() res: any, @Body() dataDto: any) {
    const object = await this.moneyService.create(dataDto);
    if (!object) throw new NotFoundException('does not exist!');
    return res.status(HttpStatus.OK).json(object);
  }

  @Put('/:id')
  async edit(@Res() res: any, @Param('id') id: any, @Body() dataDto: any) {
    const object = await this.moneyService.edit(id, dataDto);
    if (!object) throw new NotFoundException('does not exist!');
    return res.status(HttpStatus.OK).json(object);
  }

  @Get()
  async findAll(): Promise<Money[]> {
    return this.moneyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Money> {
    return this.moneyService.findOne(id);
  }

  @Post('find-one-iso')
  async findOneIso(@Body() dataDto: any) {
    const object = await this.moneyService.findOneIso(dataDto);
    return object;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.moneyService.delete(id);
  }
}
