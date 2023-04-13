import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from '../country/entities/country.entity';
import { StateCity } from './entities/state-city.entity';
import { CountryState } from '../country-state/entities/country-state.entity';

@Injectable()
export class StateCityService {
  // para manejar errores
  private readonly logger = new Logger('StateCityService');

  // CONSTRUCTOR
  constructor(
    @InjectModel(StateCity.name)
    private stateCityModel: Model<StateCity>,

    @InjectModel(CountryState.name)
    private countryStateModelo: Model<CountryState>,

    @InjectModel(Country.name)
    private countryModel: Model<Country>,
  ) {}

  async create(dataDto: any): Promise<any> {
    //dataDto.slug = await this.convertToSlug(dataDto.slug);

    const resCountryState = await this.countryStateModelo.findById(
      dataDto.CountryState,
    );
    if (resCountryState) {
      dataDto.Country = resCountryState.Country;
    }

    try {
      await this.doestExists(dataDto);
      const res = await this.stateCityModel.create(dataDto);
      return res;
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

  async update(ID: string, dataDto: any): Promise<any> {
    // no se puede cambiar pais
    try {
      //dataDto.slug = await this.convertToSlug(dataDto.slug);
      const res = await this.stateCityModel.findOneAndUpdate(
        { _id: ID },
        dataDto,
        {
          new: true,
        },
      );
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(): Promise<StateCity[]> {
    const lista = await this.stateCityModel
      .find({})
      //.populate('CountryState')
      .sort({ numero: 1 })
      .exec();
    return lista;
  }

  async findAllCountry(dataDto: any): Promise<StateCity[]> {
    try {
      if (dataDto.countrySlug) {
        const resCountry = await this.countryModel.findOne({
          slug: dataDto.countrySlug,
        });
        dataDto.Country = resCountry._id;
      }
      const res = await this.stateCityModel
        .find({ Country: dataDto.Country })
        .populate('Country')
        .populate('CountryState')
        .sort({ name: 1 })
        .exec();
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAllCountryState(dataDto: any): Promise<any> {
    try {
      const res = await this.stateCityModel
        .find({ CountryState: dataDto.CountryState })
        //.populate('Country')
        //.populate('CountryState')
        .sort({ numero: 1 })
        .exec();
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(ID: string): Promise<StateCity> {
    const object = await this.stateCityModel.findById(ID);
    //.populate('CountryState');
    return object;
  }

  async remove(ID: string): Promise<any> {
    const res = await this.stateCityModel.findByIdAndDelete(ID);
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

  async doestExists(dataDto: any): Promise<any> {
    const res = await this.stateCityModel.findOne({
      slug: dataDto.slug,
      Country: dataDto.Country,
      CountryState: dataDto.CountryState,
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
