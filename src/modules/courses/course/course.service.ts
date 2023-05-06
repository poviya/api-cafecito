import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCourseDto,
  FindAllCourseDto,
  FindAllDto,
  FindAllUserDto,
  FindAllUserMediaDto,
  UpdateCourseDto,
} from './dto/course.dto';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { PostMedia } from 'src/modules/posts/post-media/entities/post-media.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './entities/course.entity';
import { splitHastag } from 'src/common/helpers/utils';
import { AuthUserDto } from 'src/modules/auth/dto/authUser.dto';
import { CloudflareService } from 'src/modules/posts/post-media/s3/cloudflareService';
import { PostMediaService } from 'src/modules/posts/post-media/post-media.service';
import { UserService } from 'src/modules/users/user/user.service';

@Injectable()
export class CourseService {
  FOLDER = 'cafecito/course';
  // para manejar errores
  private readonly logger = new Logger('CourseService');
  ObjectId = mongoose.Types.ObjectId;
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(PostMedia.name)
    private postMediaModel: Model<PostMedia>,
    //@Inject(forwardRef(() => PostMediaService))
    private postMediaService: PostMediaService,
    private userService: UserService,
    private readonly cloudflateService: CloudflareService,
  ) {}

  async create(dataDto: any, files, user: AuthUserDto): Promise<any> {
    let resUpdate;
    try {
      console.log(dataDto);
      const code = 'CO' + this.generateRandomString(10); //+ Date.now();
      const slug = (await this.convertToSlug(dataDto.title)) + code;
      const createCourse = {
        title: dataDto.title,
        code: code,
        slug: slug,
        User: user._id,
        description: dataDto.description,
        purposes: dataDto.purposes,
        benefits: dataDto.benefits,
        whoIsItFor: dataDto.whoIsItFor,
        content: dataDto.content,
        startDate: dataDto.startDate,
        duration: dataDto.duration,
        modality: dataDto.modality,
        schedule: dataDto.schedule,
        certifiedHours: dataDto.certifiedHours,
        tags: splitHastag(dataDto.description),
        price: Number(dataDto.price),
        Money: dataDto.Money,
        comment: dataDto.comment,
      };
      const res = await this.courseModel.create(createCourse);
      const createPostMedia: any = {
        User: user._id,
        Post: res._id,
        category: 'COURSE',
      };
      //await this.amazonStorageService.uploadFileBase64(dataDto.imageBase64);
      for (const file of files) {
        if (file.originalname) {
          const idFile = file.originalname.split('.')[0];
          const fileData: any = dataDto.filesArray.find(
            (file) => file._id === idFile,
          );
          const response = await this.cloudflateService.uploadFile(
            file,
            this.FOLDER,
          );
          if (fileData.type == 'ORIGINAL') {
            createPostMedia.url = response.Location;
            createPostMedia.key = response.Key;
            createPostMedia.type = file.mimetype.split('/')[0];
            createPostMedia.extension = file.mimetype.split('/')[1];
          } else if (fileData.type == 'SNAPSHOT') {
            createPostMedia.urlSnapshot = response.Location;
            createPostMedia.keySnapshot = response.Key;
            createPostMedia.typeSnapshot = file.mimetype.split('/')[0];
            createPostMedia.extensionSnapshot = file.mimetype.split('/')[1];
          }
        }

        if (createPostMedia.type == 'video') {
          if (createPostMedia.type && createPostMedia.typeSnapshot) {
            const resMedia = await this.postMediaModel.create(createPostMedia);
            const postMedia = { $push: { PostMedia: resMedia.id } };
            console.log(resMedia);
            console.log(postMedia);
            resUpdate = await this.courseModel.findOneAndUpdate(
              { _id: res._id },
              postMedia,
              {
                new: true,
              },
            );
          }
        } else {
          const resMedia = await this.postMediaModel.create(createPostMedia);
          const postMedia = { $push: { PostMedia: resMedia.id } };
          console.log(resMedia);
          console.log(postMedia);
          resUpdate = await this.courseModel.findOneAndUpdate(
            { _id: res._id },
            postMedia,
            {
              new: true,
            },
          );
        }
      }
      return resUpdate;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(ID: string, dataDto: any): Promise<any> {
    await this.findById(ID);

    try {
      const res = await this.courseModel.findOneAndUpdate(
        {
          _id: ID,
        },
        {
          ...dataDto,
        },
      );
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findById(ID: string) {
    let res: any;
    if (isValidObjectId(ID)) {
      res = await this.courseModel
        .findOne({ _id: ID })
        .populate('PostMedia')
        .populate('Money')
        .populate('User');
    }
    if (!res) throw new NotFoundException(`Id, "${ID}" not found`);
    return res;
  }

  async findOneSlug(slug: string) {
    const res = await this.courseModel
      .findOne({ slug: slug })
      .populate('PostMedia')
      .populate('Money')
      .populate('User');

    if (!res) throw new NotFoundException(`SLug, "${slug}" not found`);
    return res;
  }

  async remove(id: string) {
    const data = await this.findById(id);
    if (data) {
      if (data.PostMedia.length > 0) {
        data.PostMedia.map(async (item) => {
          const data = {
            _id: item['id'],
            key: item.key,
          };
          this.postMediaService.deletePost(data);
        });
      }
    }

    const { deletedCount } = await this.courseModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Id "${id}" not found`);

    return data;
  }

  //++++++++++++++++++++++++  view web //////////
  async findAll(dataDto: FindAllDto, paginationDto): Promise<any> {
    const { limit = 10, offset = 0 } = paginationDto;
    let resPostCategoy: any;
    const data: any = {
      status: { $eq: dataDto.status },
    };

    if (dataDto.search) {
      if (dataDto.search.trim()) {
        data.$text = { $search: new RegExp(dataDto.search) };
      }
    }
    const [resTotal, resPost] = await Promise.all([
      this.courseModel.countDocuments({ ...data }),
      this.courseModel
        .find({ ...data })
        .populate('PostMedia')
        .populate('Money')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .exec(),
    ]);
    return {
      totalPages: resTotal,
      postCategory: resPostCategoy,
      data: resPost,
    };
  }

  async findAllInfinite(dataDto: any, paginationDto): Promise<any> {
    const { limit = 10, offset = 0 } = paginationDto;

    const data: any = {
      status: { $eq: dataDto.status },
    };

    if (dataDto.search) {
      if (dataDto.search.trim()) {
        data.$text = { $search: new RegExp(dataDto.search) };
        delete dataDto.search;
      }
    }

    const res = await this.courseModel
      .find({ ...data })
      .populate('PostMedia')
      .populate('PostCategory')
      .populate('PostSalesUnit')
      .populate('Money')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();

    return {
      data: res,
    };
  }

  async findAllCounter(dataDto: any): Promise<any> {
    const [resActive, resInactive] = await Promise.all([
      this.courseModel.countDocuments({
        status: 'ACTIVE',
      }),
      this.courseModel.countDocuments({
        status: 'SUSPENDED',
      }),
    ]);

    const data = {
      active: resActive,
      inactive: resInactive,
    };
    return data;
  }
  // end view web

  //+++++++++++++++++++++++ view user products
  async findAllUser(
    dataDto: FindAllUserDto,
    paginationDto,
    user: AuthUserDto,
  ): Promise<any> {
    const { limit = 10, offset = 0 } = paginationDto;
    const data: any = {
      //User: user._id,
      status: { $eq: dataDto.status },
    };

    if (dataDto.search) {
      if (dataDto.search.trim()) {
        data.$text = { $search: new RegExp(dataDto.search) };
        delete dataDto.search;
      }
    }
    console.log(data);
    const [resTotal, resPost] = await Promise.all([
      this.courseModel.countDocuments({ ...data }),
      this.courseModel
        .find({ ...data })
        .populate('PostMedia')
        .populate('Money')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .exec(),
    ]);
    return {
      totalPages: resTotal,
      data: resPost,
    };
  }

  async findAllUserInfinite(
    dataDto: any,
    paginationDto,
    user: AuthUserDto,
  ): Promise<any> {
    const { limit = 10, offset = 0 } = paginationDto;

    const data: any = {
      User: user._id,
      status: { $eq: dataDto.status },
    };

    if (dataDto.search) {
      if (dataDto.search.trim()) {
        data.$text = { $search: new RegExp(dataDto.search) };
        delete dataDto.search;
      }
    }

    const res = await this.courseModel
      .find({ ...data })
      .populate('PostMedia')
      .populate('Money')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();

    return {
      data: res,
    };
  }

  async findAllUserCounter(dataDto: any, user: AuthUserDto): Promise<any> {
    const [resActive, resInactive] = await Promise.all([
      this.courseModel.countDocuments({
        User: user._id,
        status: 'ACTIVE',
      }),
      this.courseModel.countDocuments({
        User: user._id,
        status: 'SUSPENDED',
      }),
    ]);

    const data = {
      active: resActive,
      inactive: resInactive,
    };
    return data;
  }
  //+++++++++++++++++++++++ end view user products

  async findAllUserMedia(dataDto: FindAllUserMediaDto) {
    const list = await this.postMediaModel
      .find({
        User: dataDto.User,
        category: 'ARTICLE',
        type: dataDto.type,
      })
      .populate('Post')
      .populate([
        {
          path: 'User',
          populate: { path: 'Profile' },
        },
      ])
      .sort({ createdAt: -1 })
      .exec();
    return list;
  }

  async findAllPosts(dataDto: FindAllCourseDto) {
    const list = await this.courseModel
      .find({ Site: { $eq: dataDto.Site } })
      .populate('PostMedia')
      .populate([
        {
          path: 'User',
          populate: { path: 'Profile' },
        },
      ])
      .sort({ createdAt: -1 })
      .exec();
    return list;
  }

  async findSearch(dataDto: any): Promise<Course[]> {
    const list = await this.courseModel
      .find({ $text: { $search: dataDto.q }, type: 'ARTICLE' })
      .populate('PostMedia')
      .populate('User')
      .sort({ createdAt: -1 })
      .exec();
    return list;
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

  generateRandomString(num) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // (error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
