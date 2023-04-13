import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CountryState } from './entities/country-state.entity';
import { Country } from '../country/entities/country.entity';

@Injectable()
export class CountryStateService {
  // para manejar errores
  private readonly logger = new Logger('CountryStateService');

  // CONSTRUCTOR
  constructor(
    @InjectModel(CountryState.name)
    private countryStateModel: Model<CountryState>,
    @InjectModel(Country.name)
    private countryModel: Model<Country>,
  ) {}

  async create(dataDTO: any): Promise<any> {
    dataDTO.slug = await this.convertToSlug(dataDTO.slug);
    //dataDTO.Country = dataDTO.idCountry;

    try {
      const object = await this.doestExists(dataDTO);
      if (!object) {
        const res = await this.countryStateModel.create(dataDTO);
        return res;
      } else {
        return {
          useExists: true,
        };
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

  async update(ID: string, dataDto: any) {
    // no se puede cambiar pais
    await this.findOne(ID);

    try {
      // if (dataDTO.slug) {
      //   dataDTO.slug = await this.convertToSlug(dataDTO.slug);
      // }
      const res = await this.countryStateModel.findOneAndUpdate(
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

  async findOne(ID: string) {
    let res: any;

    if (isValidObjectId(ID)) {
      res = await this.countryStateModel.findById(ID);
    }

    if (!res) throw new NotFoundException(`Id, name or no "${ID}" not found`);
    return res;
  }

  async findAll(): Promise<any> {
    try {
      const res = await this.countryStateModel
        .find()
        .populate('Country')
        .sort({ name: 1 })
        .exec();
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAllCountry(dataDTO: any): Promise<any> {
    try {
      if (dataDTO.countrySlug) {
        const resCountry = await this.countryModel.findOne({
          slug: dataDTO.countrySlug,
        });
        dataDTO.Country = resCountry._id;
      }
      const res = await this.countryStateModel
        .find({
          Country: dataDTO.Country,
        })
        //.populate('CountryState')
        .sort({ name: 1 })
        .exec();
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.countryStateModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0) throw new NotFoundException(`Id "${id}" not found`);

    return;
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
    const res = await this.countryStateModel.findOne({
      slug: dataDTO.slug,
      Country: dataDTO.Country,
    });
    if (res) {
      return true;
    }
    return false;
  }

  async convertToSlug(Text) {
    return Text.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
}
