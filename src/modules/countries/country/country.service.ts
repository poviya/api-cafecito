import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Country } from './entities/country.entity';

@Injectable()
export class CountryService {
  // para manejar errores
  private readonly logger = new Logger('CountryService');

  // CONSTRUCTOR
  constructor(
    @InjectModel(Country.name) private readonly countryModel: Model<Country>,
  ) {}

  async create(dataDto: any): Promise<Country> {
    //dataDto.slug = await this.convertToSlug(dataDto.name);

    try {
      const res = await this.countryModel.create(dataDto);
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, dataDto: any): Promise<any> {
    await this.findOne(id);

    try {
      const res = await this.countryModel.findOneAndUpdate(
        { _id: id },
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

  async findAll(): Promise<Country[]> {
    try {
      const res = await this.countryModel
        .find()
        //.populate('CountryState')
        .sort({ name: 1 })
        .exec();
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAllCities(): Promise<any> {
    const res = await this.countryModel.aggregate([
      { $match: { activeOnlypu: true } },
      {
        $lookup: {
          from: 'state-cities',
          localField: '_id',
          foreignField: 'Country',
          as: 'Cities',
        },
      },
      {
        $lookup: {
          from: 'post-ad-categories',
          localField: '_id',
          foreignField: 'Country',
          as: 'Categories',
        },
      },
      //{ $match: { Categories: { $exists: true, $ne: [] } } },
    ]);
    if (res) {
      return {
        ok: true,
        data: res,
        message: 'Mostrando',
      };
    } else {
      return {
        ok: true,
        data: {},
        message: 'No hay datos',
      };
    }
  }

  async searchCountry(data: any): Promise<Country> {
    const lista = await this.countryModel
      .findOne({
        ...data,
      })
      //.populate('CountryState')
      .sort({ name: 1 })
      .exec();
    return lista;
  }

  async findOne(ID: string) {
    let res: any;

    if (isValidObjectId(ID)) {
      res = await this.countryModel.findById(ID);
    }

    if (!res) throw new NotFoundException(`Id, name or no "${ID}" not found`);
    return res;
  }

  async remove(id: string) {
    const { deletedCount } = await this.countryModel.deleteOne({ _id: id });
    if (deletedCount === 0) throw new NotFoundException(`Id "${id}" not found`);

    return;
  }

  async doestExists(dataDto: Country): Promise<any> {
    const user = await this.countryModel.findOne({ slug: dataDto.slug });
    if (user) {
      return true;
    }
    return false;
  }

  private handleDBExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    //this.logger.error(error);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  async convertToSlug(Text) {
    return Text.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
}
