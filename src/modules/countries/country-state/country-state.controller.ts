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
import { CountryState } from './entities/country-state.entity';
import { CountryStateService } from './country-state.service';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id/parse-mongo-id.pipe';

//@UseGuards(JwtAuthGuard)

@Controller('country-state')
export class CountryStateController {
  constructor(private readonly countryStateService: CountryStateService) {}

  @Post()
  async create(@Body() createCatDto: any) {
    const res = await this.countryStateService.create(createCatDto);
    return res;
  }

  @Put(':id')
  async update(@Param('id') id: any, @Body() dataDTO: any) {
    const res = await this.countryStateService.update(id, dataDTO);
    return res;
  }

  @Get()
  findAll() {
    return this.countryStateService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.countryStateService.remove(id);
  }

  @Post('/country')
  async findAllCountry(@Body() data: any) {
    const object = await this.countryStateService.findAllCountry(data);
    //return res.status(HttpStatus.OK).json(object);
    return object;
  }
}
