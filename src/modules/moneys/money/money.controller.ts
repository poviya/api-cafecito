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
  async create(@Body() dataDto: any) {
    const res = await this.moneyService.create(dataDto);
    return res;
  }

  @Put('/:id')
  async edit(@Param('id') id: any, @Body() dataDto: any) {
    const res = await this.moneyService.edit(id, dataDto);
    return res;
  }

  @Get()
  async findAll(): Promise<Money[]> {
    return this.moneyService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Money> {
    return this.moneyService.findById(id);
  }

  @Post('find-one')
  async findOne(@Body() dataDto: any) {
    const object = await this.moneyService.findOne(dataDto);
    return object;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.moneyService.delete(id);
  }
}
