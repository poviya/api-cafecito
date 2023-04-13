import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostAdCategory } from './entities/post-ad-category.entity';
import { Country } from 'src/modules/countries/country/entities/country.entity';

@Injectable()
export class PostAdCategoryService {
  // para manejar errores
  private readonly logger = new Logger('AdCategoryService');

  // CONSTRUCTOR
  constructor(
    @InjectModel(PostAdCategory.name)
    private adCategoryModel: Model<PostAdCategory>,
    @InjectModel(Country.name)
    private countryModel: Model<Country>,
  ) {}

  async create(dataDto: any): Promise<any> {
    //dataDto.slug = await this.convertToSlug(dataDto.name);
    //dataDto.Country = dataDto.Country;
    console.log(dataDto);
    try {
      const object = await this.doestExists(dataDto);
      // if (!object) {
      //   const res = await this.adCategoryModel.create(dataDto);
      //   return res;
      // } else {
      //   const object = {
      //     useExists: true,
      //   };
      //   return object;
      // }
      if (!object) {
        const res = await this.adCategoryModel.create(dataDto);
        return {
          ok: true,
          data: res,
          message: 'Se creo exitosamente',
        };
      } else {
        return {
          ok: false,
          data: {
            useExists: true,
          },
          message: 'Ya existe',
        };
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(ID: string, dataDto: any): Promise<any> {
    //console.log(dataDto);
    //dataDto.slug = await this.convertToSlug(dataDto.name);
    dataDto.updatedAt = new Date();
    const resUpdate = await this.adCategoryModel.updateOne(
      { _id: ID },
      dataDto,
      {
        new: true,
      },
    );

    if (resUpdate.modifiedCount > 0) {
      const res = await this.findOne(ID);
      return {
        ok: true,
        data: res,
        message: 'Se actualizo',
      };
    } else {
      return {
        ok: true,
        data: {},
        message: 'No se actualizo',
      };
    }
  }

  async findAll(): Promise<PostAdCategory[]> {
    const lista = await this.adCategoryModel
      .find({})
      //.populate('CountryState')
      .sort({ numero: 1 })
      .exec();
    return lista;
  }

  async findAllCountry(dataDto: any): Promise<any> {
    try {
      //dataDto.Country = dataDto.idCountry;

      if (dataDto.countrySlug) {
        const resCountry = await this.countryModel.findOne({
          slug: dataDto.countrySlug,
        });
        dataDto.Country = resCountry._id;
      }
      const res = await this.adCategoryModel
        .find({ Country: dataDto.Country })
        //.populate('CountryState')
        .sort({ order: 1 })
        .exec();
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAllQuery(dataDto: any): Promise<PostAdCategory[]> {
    const res = await this.adCategoryModel
      .find({ Country: dataDto.Country })
      //.populate('CountryState')
      .sort({ numero: 1 })
      .exec();
    return res;
  }

  async findOne(ID: string): Promise<PostAdCategory> {
    const object = await this.adCategoryModel.findById(ID);
    return object;
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    await this.adCategoryModel.remove(data);
  }

  async doestExists(dataDto: any): Promise<any> {
    const res = await this.adCategoryModel.findOne({
      slug: dataDto.slug,
      Country: dataDto.Country,
    });
    if (res) {
      return true;
    }
    return false;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
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
