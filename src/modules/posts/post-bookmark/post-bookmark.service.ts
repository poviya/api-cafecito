import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthUserDto } from 'src/modules/auth/dto/authUser.dto';
import { Posts } from '../post/entities/post.entity';
import { CreatePostBookmarkDto } from './dto/post-bookmark.dto';
import { PostBookmark } from './entities/post-bookmark.entity';

@Injectable()
export class PostBookmarkService {
  constructor(
    @InjectModel(PostBookmark.name)
    private readonly PostBookmarkModel: Model<PostBookmark>,
    @InjectModel(Posts.name) private postModel: Model<Posts>,
  ) {}

  async create(dataDto: CreatePostBookmarkDto, user: AuthUserDto) {
    const resExists = await this.PostBookmarkModel.findOne({
      Post: { $eq: dataDto.Post },
      User: { $eq: user._id },
    });
    if (!resExists) {
      const data = {
        Post: dataDto.Post,
        User: user._id,
        like: true,
      };

      // sum likes
      const [res, resBookmarkes] = await Promise.all([
        await this.PostBookmarkModel.create(data),
        await this.PostBookmarkModel.countDocuments({
          Post: { $eq: dataDto.Post },
        }),
      ]);

      await this.postModel.updateOne(
        { _id: dataDto.Post },
        {
          bookmarkes: Number(resBookmarkes) + 1,
        },
        {
          new: true,
        },
      );
      return res;
    } else {
      return resExists;
    }
  }

  async edit(ID: string, datosDTO: any): Promise<any> {
    const res = await this.PostBookmarkModel.updateOne({ _id: ID }, datosDTO, {
      new: true,
    });
    return res;
  }

  async findAll(): Promise<PostBookmark[]> {
    return this.PostBookmarkModel.find().sort({ codigo: 1 }).exec();
  }

  async findAllUser(dataDto: any, paginationDto): Promise<any> {
    console.log(paginationDto);
    const { limit = 10, offset = 0 } = paginationDto;
    const resTotal = await this.PostBookmarkModel.find({
      User: { $eq: dataDto.User },
    });
    const res = await this.PostBookmarkModel.find({
      User: { $eq: dataDto.User._id },
    })
      .populate([
        {
          path: 'Post',
          populate: { path: 'Country' },
        },
        {
          path: 'Post',
          populate: { path: 'CountryState' },
        },
        {
          path: 'Post',
          populate: { path: 'StateCity' },
        },
        {
          path: 'Post',
          populate: { path: 'PostAdCategory' },
        },
        {
          path: 'Post',
          populate: { path: 'PostMedia' },
        },
      ])
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .exec();
    return {
      totalPages: resTotal.length,
      data: res,
    };
  }

  async findAllUserInfinite(dataDto: any, paginationDto): Promise<any> {
    console.log(paginationDto);
    const { limit = 10, offset = 0 } = paginationDto;
    const res = await this.PostBookmarkModel.find({
      User: { $eq: dataDto.User },
    })
      .populate([
        {
          path: 'Post',
          populate: { path: 'Country' },
        },
        {
          path: 'Post',
          populate: { path: 'CountryState' },
        },
        {
          path: 'Post',
          populate: { path: 'StateCity' },
        },
        {
          path: 'Post',
          populate: { path: 'PostAdCategory' },
        },
        {
          path: 'Post',
          populate: { path: 'PostMedia' },
        },
      ])
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .exec();

    return {
      data: res,
    };
  }

  async findOneUser(dataDto: any): Promise<PostBookmark> {
    return this.PostBookmarkModel.findOne({
      User: dataDto.User,
      Post: dataDto.Post,
    }).exec();
  }

  async findOne(id: string): Promise<PostBookmark> {
    return this.PostBookmarkModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const res = await this.PostBookmarkModel.findByIdAndRemove({
      _id: id,
    }).exec();
    // sum likes
    if (res) {
      const resBookmarkes = await this.PostBookmarkModel.find({
        Post: { $eq: res.Post },
      });
      await this.postModel.updateOne(
        { _id: res.Post },
        {
          likes: resBookmarkes.length,
        },
        {
          new: true,
        },
      );
      return res;
    }
  }
}
