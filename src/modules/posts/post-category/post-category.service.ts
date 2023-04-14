import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostCategoryDto, UpdatePostCategoryDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { PostCategory } from './entities/post-category.entity';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class PostCategoryService {
  // para manejar errores
  private readonly logger = new Logger('AdCategoryService');

  // CONSTRUCTOR
  constructor(
    @InjectModel(PostCategory.name)
    private postCategoryModel: Model<PostCategory>,
  ) {}

  async create(dataDto: CreatePostCategoryDto): Promise<any> {
    try {
      const object = await this.doestExists(dataDto);
      if (!object) {
        const res = await this.postCategoryModel.create(dataDto);
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

  async update(ID: string, dataDto: UpdatePostCategoryDto): Promise<any> {
    this.findOne(ID);
    //console.log(dataDto);
    const res = await this.postCategoryModel.findOneAndUpdate(
      { _id: ID },
      dataDto,
      {
        new: true,
      },
    );

    return res;
  }

  async findAll(): Promise<PostCategory[]> {
    const lista = await this.postCategoryModel
      .find({})
      //.populate('CountryState')
      .sort({ numero: 1 })
      .exec();
    return lista;
  }

  async findAllQuery(dataDto: any): Promise<PostCategory[]> {
    const res = await this.postCategoryModel
      .find({ Country: dataDto.Country })
      //.populate('CountryState')
      .sort({ numero: 1 })
      .exec();
    return res;
  }

  async findOne(ID: string): Promise<PostCategory> {
    let res: any;

    if (isValidObjectId(ID)) {
      res = await this.postCategoryModel.findById(ID);
    }

    if (!res) throw new NotFoundException(`Id, name or no "${ID}" not found`);
    return res;
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    await this.postCategoryModel.remove(data);
  }

  async doestExists(dataDto: any): Promise<any> {
    const res = await this.postCategoryModel.findOne({
      slug: dataDto.slug,
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
