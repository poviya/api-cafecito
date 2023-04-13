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
import { StateCity } from './entities/state-city.entity';
import { StateCityService } from './state-city.service';

@Controller('state-city')
export class StateCityController {
  constructor(private readonly stateCityService: StateCityService) {}

  @Post()
  async create(@Res() res: any, @Body() createCatDto: any) {
    const object = await this.stateCityService.create(createCatDto);
    return res.status(HttpStatus.OK).json(object);
  }

  @Put(':id')
  async update(@Res() res: any, @Param('id') id: any, @Body() dataDTO: any) {
    const objeto = await this.stateCityService.update(id, dataDTO);
    if (!objeto) throw new NotFoundException('No exists!');
    return res.status(HttpStatus.OK).json(objeto);
  }

  @Get()
  findAll() {
    return this.stateCityService.findAll();
  }

  @Delete(':id')
  async remove(@Res() res: any, @Param('id') ID: any) {
    const eliminado = await this.stateCityService.remove(ID);
    if (!eliminado) throw new NotFoundException('El registro no existe!');
    return res.status(HttpStatus.OK).json({
      mensaje: 'Eliminada, exitosamente',
      eliminado,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<StateCity> {
    return this.stateCityService.findOne(id);
  }

  @Post('/country')
  async findAllCountry(@Res() res: any, @Body() data: any) {
    const object = await this.stateCityService.findAllCountry(data);
    return res.status(HttpStatus.OK).json(object);
  }

  @Post('/country-state')
  async findAllCountryState(@Body() data: any) {
    const object = await this.stateCityService.findAllCountryState(data);
    return object;
  }
}
