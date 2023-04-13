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
import { CityZone } from './entities/city-zone.entity';
import { CityZoneService } from './city-zone.service';

@Controller('city-zone')
export class CityZoneController {
  constructor(private readonly cityZoneService: CityZoneService) {}

  @Post()
  async create(@Body() createCatDto: any) {
    const res = await this.cityZoneService.create(createCatDto);
    return res;
  }

  @Put(':id')
  async update(@Res() res: any, @Param('id') id: any, @Body() dataDTO: any) {
    const objeto = await this.cityZoneService.update(id, dataDTO);
    if (!objeto) throw new NotFoundException('No exists!');
    return res.status(HttpStatus.OK).json(objeto);
  }

  @Get()
  findAll() {
    return this.cityZoneService.findAll();
  }

  @Post('/city')
  async findAllCountry(@Res() res: any, @Body() data: any) {
    const object = await this.cityZoneService.findAllCity(data);
    return res.status(HttpStatus.OK).json(object);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CityZone> {
    return this.cityZoneService.findOne(id);
  }

  @Delete(':id')
  async remove(@Res() res: any, @Param('id') ID: any) {
    const eliminado = await this.cityZoneService.remove(ID);
    if (!eliminado) throw new NotFoundException('El registro no existe!');
    return res.status(HttpStatus.OK).json({
      mensaje: 'Eliminada, exitosamente',
      eliminado,
    });
  }
}
