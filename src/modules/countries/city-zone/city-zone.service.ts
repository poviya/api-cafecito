import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from '../country/entities/country.entity';
import { StateCity } from '../state-city/entities/state-city.entity';
import { CountryState } from '../country-state/entities/country-state.entity';
import { CityZone } from './entities/city-zone.entity';

@Injectable()
export class CityZoneService {
  // para manejar errores
  private readonly logger = new Logger('CityZoneService');

  // CONSTRUCTOR
  constructor(
    @InjectModel(CityZone.name)
    private cityZoneModelo: Model<CityZone>,

    @InjectModel(StateCity.name)
    private stateCityModelo: Model<StateCity>,

    @InjectModel(CountryState.name)
    private countryStateModelo: Model<CountryState>,

    @InjectModel(Country.name)
    private countryModelo: Model<Country>,
  ) {}

  async create(dataDTO: any) {
    try {
      const resStateCity = await this.stateCityModelo.findById(
        dataDTO.StateCity,
      );
      if (!resStateCity)
        throw new NotFoundException(
          `Id, name or no "${dataDTO.StateCity}" not found`,
        );
      //dataDTO.slug = await this.convertToSlug(dataDTO.slug);
      dataDTO.Country = resStateCity.Country;
      dataDTO.CountryState = resStateCity.CountryState;
      dataDTO.StateCity = resStateCity._id;

      const object = await this.doestExists(dataDTO);
      if (!object) {
        const res = await this.cityZoneModelo.create(dataDTO);
        return res;
      } else {
        const object = {
          useExists: true,
        };
        return object;
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  /*
  async create2(datosDTO: any): Promise<any> {
    datosDTO.id = new Date().toISOString();
    const objeto = await this.countryModelo.findOne({
      Country: { $eq: datosDTO.Country },
    });

    console.log('TAMAÑO DE COUNTRYSTATES: ', objeto.CountryStates.length);
 
    const countryStates = { $push: { CountryStates: datosDTO } };
    const res = await this.countryModelo.updateOne(
      { _id: datosDTO.Country },
      countryStates,
      {
        new: true,
      },
    );
    return res;
  }*/

  async update(ID: string, dataDTO: any): Promise<any> {
    // just modify slug y name
    try {
      //.slug = await this.convertToSlug(dataDTO.slug);
      dataDTO.updatedAt = new Date();
      const res = await this.cityZoneModelo.updateOne({ _id: ID }, dataDTO, {
        new: true,
      });
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(): Promise<CityZone[]> {
    const lista = await this.cityZoneModelo
      .find({})
      //.populate('CountryState')
      .sort({ numero: 1 })
      .exec();
    return lista;
  }

  async findOne(ID: string): Promise<CityZone> {
    const object = await this.cityZoneModelo
      .findById(ID)
      .populate('Country')
      .populate('CountryState')
      .populate('StateCity');
    return object;
  }

  async findAllCity(dataDTO: any): Promise<CityZone[]> {
    const res = await this.cityZoneModelo
      .find({ StateCity: dataDTO.StateCity })
      //.populate('CountryState')
      .sort({ name: 1 })
      .exec();
    return res;
  }

  async remove(ID: string): Promise<any> {
    const res = await this.cityZoneModelo.findByIdAndDelete(ID);
    return res;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  async doestExists(dataDTO: any): Promise<any> {
    const res = await this.cityZoneModelo.findOne({
      slug: dataDTO.slug,
      Country: dataDTO.Country,
      CountryState: dataDTO.CountryState,
      StateCity: dataDTO.StateCity,
    });
    if (res) {
      return true;
    }
    return false;
  }

  convertToSlug(Text) {
    return Text.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
}
