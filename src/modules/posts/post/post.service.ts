import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import e from 'express';
import { isValidObjectId, Model } from 'mongoose';
import { UserService } from 'src/modules/users/user/user.service';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { PostMediaService } from '../post-media/post-media.service';
import { AmazonStorageService } from '../post-media/s3/amazonStorageService';
import { splitHastag } from 'src/common/helpers/utils';
import {
  FindAllPostDto,
  FindAllUserDto,
  FindAllUserMediaDto,
} from './dto/post.dto';
import { Posts } from './entities/post.entity';
import { AuthUserDto } from 'src/modules/auth/dto/authUser.dto';
import { CloudflareService } from '../post-media/s3/cloudflareService';

@Injectable()
export class PostService {
  FOLDER = 'cafecito/post';
  // para manejar errores
  private readonly logger = new Logger('PostService');
  constructor(
    @InjectModel(Posts.name) private postModel: Model<Posts>,
    @InjectModel(PostMedia.name)
    private postMediaModel: Model<PostMedia>,
    //@Inject(forwardRef(() => PostMediaService))
    private postMediaService: PostMediaService,
    private userService: UserService,
    private readonly amazonStorageService: AmazonStorageService,
    private readonly cloudflateService: CloudflareService,
  ) {}

  async create(dataDto: any, files, user: AuthUserDto): Promise<any> {
    let resUpdate;
    try {
      console.log(dataDto);
      const code = 'CO' + this.generateRandomString(10) + Date.now();
      const slug = (await this.convertToSlug(dataDto.title)) + code;
      const createPost = {
        title: dataDto.title,
        code: code,
        slug: slug,
        User: user._id,
        description: dataDto.description,
        PostSalesUnit: dataDto.PostSalesUnit,
        PostCategory: dataDto.PostCategory,
        price: dataDto.price,
        Money: dataDto.Money,
        tags: splitHastag(dataDto.description),
        type: 'ARTICLE',
        weight: dataDto.weight,
        comment: dataDto.comment,
      };
      const res = await this.postModel.create(createPost);
      const createPostMedia: any = {
        User: user._id,
        Post: res._id,
        category: 'ARTICLE',
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
            resUpdate = await this.postModel.findOneAndUpdate(
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
          resUpdate = await this.postModel.findOneAndUpdate(
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
    await this.findOne(ID);

    try {
      const res = await this.postModel.findOneAndUpdate(dataDto);
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(ID: string) {
    let res: any;

    if (isValidObjectId(ID)) {
      res = await this.postModel
        .findOne({ _id: ID, type: 'ARTICLE' })
        .populate('PostCategory')
        .populate('PostSalesUnit')
        .populate('PostMedia')
        .populate('User');
    }

    if (!res) throw new NotFoundException(`Id, name or no "${ID}" not found`);
    return res;
  }

  async findOneId(ID: string) {
    let res: any;

    if (isValidObjectId(ID)) {
      res = await this.postModel.findById(ID);
    }

    if (!res) throw new NotFoundException(`Id, name or no "${ID}" not found`);
    return res;
  }

  async remove(id: string) {
    const data = await this.findOneId(id);
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

    const { deletedCount } = await this.postModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Id "${id}" not found`);

    return data;
  }

  async findAll(dataDto: any, paginationDto): Promise<any> {
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

    console.log(data);
    const [resTotal, resPost] = await Promise.all([
      this.postModel.countDocuments({ ...data, type: 'ARTICLE' }),
      this.postModel
        .find({ ...data, type: 'ARTICLE' })
        .populate('PostMedia')
        .populate('PostCategory')
        .populate('PostSalesUnit')
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

    const res = await this.postModel
      .find({ ...data, type: 'ARTICLE' })
      .populate('PostMedia')
      .populate('PostCategory')
      .populate('PostSalesUnit')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();

    return {
      data: res,
    };
  }

  async findAllUser(dataDto: FindAllUserDto) {
    console.log(dataDto);
    const user = await this.userService.slug(dataDto);
    if (user) {
      const list = await this.postModel
        .find({ User: user._id, type: 'ARTICLE' })
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
    } else {
      return null;
    }
  }

  async findAllCounter(dataDto: any): Promise<any> {
    const [resActive, resInactive] = await Promise.all([
      this.postModel.countDocuments({
        status: 'ACTIVE',
        type: 'ARTICLE',
      }),
      this.postModel.countDocuments({
        status: 'SUSPENDED',
      }),
    ]);

    const data = {
      active: resActive,
      inactive: resInactive,
    };
    return data;
  }

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

  async findAllPosts(dataDto: FindAllPostDto) {
    const list = await this.postModel
      .find({ Site: { $eq: dataDto.Site }, type: 'ARTICLE' })
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

  async findSearch(dataDto: any): Promise<Posts[]> {
    const list = await this.postModel
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

  splitChaing(str: string) {
    const arr = str.split(' ');
    const res = this.splitHastag(arr);
    return res;
  }

  splitHastag(array: string[]) {
    const tags: string[] = [];
    for (const item of array) {
      const checkIsvalid = this.checkIfValidHashtag(item);
      if (checkIsvalid) {
        const a = item.split('#');
        tags.push(a[1]);
      }
    }
    return tags;
  }

  checkIfValidHashtag(str: string) {
    // Regular expression to check if string is a hashtag
    const regexExp = /^#[^ !@#$%^&*(),.?":{}|<>]*$/gi;

    return regexExp.test(str);
  }
}
