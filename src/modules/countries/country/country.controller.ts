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
import { Country } from './entities/country.entity';
import { CountryService } from './country.service';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id/parse-mongo-id.pipe';

//@UseGuards(JwtAuthGuard)
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  async create(@Body() createCatDto: any) {
    const res = await this.countryService.create(createCatDto);
    return res;
  }

  @Get()
  async findAll() {
    const res = await this.countryService.findAll();
    return res;
  }

  @Get('country-cities')
  findAllCities() {
    return this.countryService.findAllCities();
  }

  @Post('search')
  async findCountry(@Res() res: any, @Body() dataDto: any) {
    const object = await this.countryService.searchCountry(dataDto);
    return res.status(HttpStatus.OK).json(object);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Country> {
    return this.countryService.findOne(id);
  }

  @Put(':id')
  async update(@Res() res: any, @Param('id') id: any, @Body() dataDTO: any) {
    const objeto = await this.countryService.update(id, dataDTO);
    if (!objeto) throw new NotFoundException('No exists!');
    return res.status(HttpStatus.OK).json(objeto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.countryService.remove(id);
  }
}
