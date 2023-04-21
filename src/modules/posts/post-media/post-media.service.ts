import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as AWS from 'aws-sdk';
import { Model } from 'mongoose';
import { Posts } from '../post/entities/post.entity';
import { PostMedia } from './entities/post-media.entity';
import { v4 as uuid } from 'uuid';
import { User } from 'src/modules/users/user/entities/user.entity';
import { AmazonStorageService } from 'src/modules/posts/post-media/s3/amazonStorageService';
import { UtilsMediaService } from './utils/snapshot';
import { CloudflareService } from './s3/cloudflareService';

@Injectable()
export class PostMediaService {
  AWS_BUCKET = process.env.AWS_BUCKET;
  FOLDER = 'fanspi/post';
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  // para manejar errores
  private readonly logger = new Logger('CountryStateService');

  constructor(
    @InjectModel(PostMedia.name)
    private postMediaModel: Model<PostMedia>,
    @InjectModel(Posts.name) private postModel: Model<Posts>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly amazonStorageService: AmazonStorageService,
    private readonly cloudflareService: CloudflareService,
    private readonly utilsMediaService: UtilsMediaService,
  ) {}

  async create(dataDTO: any, files) {
    //console.log(dataDTO.Ad);
    //console.log(files)

    //const objeto = await this.adModelo.findById(dataDTO.Ad);

    //console.log('TAMAÑO DE IMAGES: ', objeto.AdImages.length);

    for (const file of files) {
      const response = await this.cloudflareService.uploadFile(
        file,
        this.FOLDER,
      );
      console.log(response);
      const dataImage = {
        _id: uuid(),
        key: response.Key,
        url: response.Location,
      };

      const postImages = { $push: { AdImages: dataImage } };
      await this.postModel.updateOne({ _id: dataDTO._id }, postImages, {
        new: true,
      });
    }
    //return res;
  }

  async create2(dataDTO: any, files) {
    //console.log(dataDTO.Ad);
    //console.log(files);

    //const objeto = await this.adModelo.findById(dataDTO.Ad);

    //console.log('TAMAÑO DE IMAGES: ', objeto.AdImages.length);
    for (const item of files) {
      //console.log(item);
    }
    for (const file of files) {
      const response = await this.amazonStorageService.uploadFile(
        file,
        this.FOLDER,
      );
      console.log('--->' + response);
      const dataImage = {
        User: dataDTO.User,
        Post: dataDTO._id,
        category: 'POST',
        key: response.Key,
        url: response.Location,
      };

      const res = await this.postMediaModel.create(dataImage);
      const postMedia = { $push: { PostMedia: res.id } };
      await this.postModel.updateOne({ _id: dataDTO._id }, postMedia, {
        new: true,
      });
    }
  }

  async createCover(dataDTO: any, files): Promise<any> {
    // console.log(files);

    //const objeto = await this.adModelo.findById(dataDTO.Ad);

    //console.log('TAMAÑO DE IMAGES: ', objeto.AdImages.length);
    for (const item of files) {
      // console.log(item);
    }
    for (const file of files) {
      const response = await this.amazonStorageService.uploadFile(
        file,
        this.FOLDER,
      );
      console.log(response);
      const dataImage = {
        User: dataDTO.User._id,
        category: 'PROFILE',
        key: response.Key,
        url: response.Location,
      };

      const res = await this.postMediaModel.create(dataImage);
      const postMedia = { $push: { Cover: res.id } };
      const resCreate = this.userModel.updateOne(
        { _id: dataDTO.User._id },
        postMedia,
        {
          new: true,
        },
      );
      return resCreate;
    }
  }

  async createProfile(dataDTO: any, files): Promise<any> {
    try {
      // console.log(files);
      // DELETE PROFILES
      //this.deleteProfile();
      //const objeto = await this.adModelo.findById(dataDTO.Ad);

      //console.log('TAMAÑO DE IMAGES: ', objeto.AdImages.length);
      console.log(dataDTO);
      if (dataDTO.User.Profile) {
        for (const item of dataDTO.User.Profile) {
          this.deleteProfile(item);
        }
      }
      for (const file of files) {
        const response = await this.amazonStorageService.uploadFile(
          file,
          this.FOLDER,
        );
        console.log(response);
        const dataImage = {
          User: dataDTO.User._id,
          category: 'PROFILE',
          key: response.Key,
          url: response.Location,
        };
        const res = await this.postMediaModel.create(dataImage);
        const postMedia = { $push: { Profile: res.id } };
        // const resCreate = this.userModel.updateOne({ _id: User }, postMedia, {
        //   new: true,
        // });
        const [resCreate, resUser] = await Promise.all([
          this.userModel.updateOne({ _id: dataDTO.User._id }, postMedia, {
            new: true,
          }),
          this.userModel
            .findById(dataDTO.User._id)
            .populate('Cover')
            .populate('Profile'),
        ]);
        // const resUser = this.userModel.findOne(User._id);
        return {
          ok: true,
          data: resUser,
          message: 'Exitosa',
        };
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async deletePost(dataDTO: any): Promise<any> {
    try {
      const PostMedia = {
        $pull: { PostMedia: dataDTO._id },
      };
      const res = await this.postModel.updateOne(
        {
          _id: dataDTO.Post,
          PostMedia: dataDTO._id,
        },
        PostMedia,
        {
          new: true,
        },
      );

      const resDelete = await this.postMediaModel.findByIdAndDelete(
        dataDTO._id,
      );
      console.log(resDelete);
      if (resDelete.key) {
        this.cloudflareService.s3Delete(resDelete.key);
      }
      if (resDelete.keySnapshot) {
        this.cloudflareService.s3Delete(resDelete.keySnapshot);
      }
      return res;
    } catch (error) {
      //this.handleDBExceptions(error);
    }
  }

  async deleteCover(dataDTO: any): Promise<any> {
    try {
      const data = await this.findOne(dataDTO._id);
      if (data) {
        const PostMedia = {
          $pull: { Cover: dataDTO._id },
        };
        const res = await this.userModel.updateOne(
          {
            _id: dataDTO.User,
            Cover: dataDTO._id,
          },
          PostMedia,
          {
            new: true,
          },
        );

        const resDelete = await this.postMediaModel.findByIdAndDelete(
          dataDTO._id,
        );
        if (resDelete.key) {
          this.amazonStorageService.s3Delete(dataDTO.key);
        }
        return res;
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async deleteProfile(dataDTO: any): Promise<any> {
    try {
      const data = await this.findOne(dataDTO._id);
      if (data) {
        const PostMedia = {
          $pull: { Profile: dataDTO._id },
        };
        const res = await this.userModel.updateOne(
          {
            _id: dataDTO.User,
            Profile: dataDTO._id,
          },
          PostMedia,
          {
            new: true,
          },
        );

        const resDelete = await this.postMediaModel.findByIdAndDelete(
          dataDTO._id,
        );
        if (resDelete) {
          if (resDelete.key) {
            this.amazonStorageService.s3Delete(dataDTO.key);
          }
        }
        return res;
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(ID: string): Promise<PostMedia> {
    const object = await this.postMediaModel.findById(ID);
    return object;
  }

  async updateMedia(): Promise<Posts[]> {
    const resPost = await this.postModel
      .find({})
      //.populate('CountryState')
      .sort({ numero: 1 })
      .exec();
    resPost.map(async (item) => {
      console.log(item._id);
      const resMedia = await this.postMediaModel
        .find({
          Post: item._id,
        })
        .exec();
      resMedia.map(async (itemMedia) => {
        const postMedia = { $push: { PostMedia: itemMedia.id } };
        await this.postModel.updateOne({ _id: item._id }, postMedia, {
          new: true,
        });
      });
    });

    return resPost;
  }

  async snapshot(file) {
    const res = await this.utilsMediaService.getVideoSnapshot(
      file,
      '/path/to/snapshot',
      5,
    );
    console.log('spanshot', res);
  }

  async fix(): Promise<any> {
    const list = await this.postMediaModel.find();
    list.map(async (item) => {
      let dataDtoPost = {};
      if (item.type == 'PHOTO') {
        console.log(1);
        dataDtoPost = {
          type: 'image',
        };
        await this.postMediaModel.updateOne({ _id: item._id }, dataDtoPost, {
          new: true,
        });
      }
    });
    return null;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
