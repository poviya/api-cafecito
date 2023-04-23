import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreatePostCategoryDto,
  FindOneSlugDto,
  UpdatePostCategoryDto,
} from './dto';
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
    const slug = await this.convertToSlug(dataDto.name);
    const object = await this.doestExists(slug);
    if (object) {
      throw new BadRequestException(`Exists slug ${slug}`);
    }
    try {
      dataDto.slug = slug;
      const res = await this.postCategoryModel.create(dataDto);
      return res;
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
      .sort({ name: 1 })
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

  async findOneSlug(dataDto: FindOneSlugDto) {
    const res = await this.postCategoryModel.findOne({ slug: dataDto.slug });

    if (!res) throw new NotFoundException(`Slug, "${dataDto.slug}" not found`);
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

  async doestExists(slug: any): Promise<any> {
    const res = await this.postCategoryModel.findOne({
      slug: slug,
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
    // remove emojis
    Text = Text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      '',
    );
    Text = Text.slice(0, 30);
    return Text.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
}
