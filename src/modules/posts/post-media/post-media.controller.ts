import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Res,
  Body,
  Put,
  NotFoundException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

import { PostMediaService } from './post-media.service';
import { fileFilter } from './helpers';
import { CurrentUser } from 'src/modules/auth/current-user.decorator';

import * as path from 'path';
import { join } from 'path';

import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { diskStorage } from 'multer';

@Controller('post-media')
export class PostMediaController {
  constructor(private readonly postMediaService: PostMediaService) {}

  async updateMedia(
    @Res() res: any,
    @Param('id') id: any,
    @Body() dataDTO: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: any,
  ) {
    if (!files) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const createDto = JSON.parse(dataDTO.data);
    //createDto.User = await user;
    if (files.length > 0) {
      const dataDTO = {
        _id: id,
      };
      const object = this.postMediaService.create2(dataDTO, files);
      return res.status(HttpStatus.OK).json(object);
    }

    //const object = dataDTO;
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  uploadPostImage(
    @Body() dataDTO: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    //console.log(dataDTO);
    console.log({ file });
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    //this.adImageService.create(dataDTO, file);
    //this.adImageService.uploadFile(file);
  }

  @Post('upload-multiple')
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: fileFilter,
    }),
  )
  uploadAdImages(
    @Res() res: any,
    @Body() dataDTO: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    //this.adImageService.uploadFileMultiple(files);
    //this.adImageService.create(dataDTO, files);
    console.log(dataDTO);
    console.log(files);
    const object = dataDTO;
    return res.status(HttpStatus.OK).json(object);
  }

  @Post('delete')
  async delete(
    @Res() res: any,
    @Body() dataDTO: any,
    @CurrentUser() user: any,
  ) {
    //dataDTO.usuarioEditor = await user.username;
    const object = await this.postMediaService.deletePost(dataDTO);
    if (!object) throw new NotFoundException('No exists!');
    return res.status(HttpStatus.OK).json(object);
  }

  @Post('delete-cover')
  async deleteCover(
    @Res() res: any,
    @Body() dataDTO: any,
    @CurrentUser() user: any,
  ) {
    //dataDTO.usuarioEditor = await user.username;
    const object = await this.postMediaService.deleteCover(dataDTO);
    if (!object) throw new NotFoundException('No exists!');
    return res.status(HttpStatus.OK).json(object);
  }

  @Post('delete-profile')
  async deleteProfile(
    @Res() res: any,
    @Body() dataDTO: any,
    @CurrentUser() user: any,
  ) {
    //dataDTO.usuarioEditor = await user.username;
    const object = await this.postMediaService.deleteProfile(dataDTO);
    if (!object) throw new NotFoundException('No exists!');
    return res.status(HttpStatus.OK).json(object);
  }

  @Get('update-media')
  findAll() {
    return this.postMediaService.updateMedia();
  }

  @Post('/fix')
  async example(
    @Query() paginationDto: any,
    @Body() dataDto: any,
    @CurrentUser() user: any,
  ) {
    dataDto.User = await user;
    const res = await this.postMediaService.fix();
    return res;
  }

  @Post('snapshot')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  videSpanshot(
    @Body() dataDTO: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    //console.log(dataDTO);
    //console.log({ file });
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    this.postMediaService.snapshot(file);
    //this.adImageService.create(dataDTO, file);
    //this.adImageService.uploadFile(file);
  }

  @Post('thumbnails')
  @UseInterceptors(FileInterceptor('video'))
  async getVideoThumbnail(@UploadedFile() video: Express.Multer.File) {
    // Obtener la ruta del archivo del video
    const videoFilePath = video; //path.join(__dirname, '..', 'uploads', video.filename);

    // Obtener la ruta del archivo de la imagen en miniatura
    const thumbnailFilePath = path.join(
      __dirname,
      '..',
      'uploads',
      'thumbnails',
      `${video.filename}.png`,
    );

    // Crear la instancia de ffmpeg
    const command = ffmpeg(videoFilePath);

    // Tomar la captura de pantalla del video en el segundo 2 y guardarla como imagen
    command
      .on('end', () => console.log('captura de pantalla tomada exitosamente'))
      .on('error', (err) =>
        console.error('Error al tomar captura de pantalla:', err),
      )
      .screenshots({
        count: 1,
        folder: path.join(__dirname, '..', 'uploads', 'thumbnails'),
        filename: `${video.filename}.png`,
        size: '320x240',
        timemarks: ['2'],
      });

    // Retornar la ruta de la imagen en miniatura
    return { thumbnailPath: thumbnailFilePath };
  }

  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './videos',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}_${file.originalname}`);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file) {
    const { path } = file;
    const screenshotsDir = join(path, '../screenshots');
    const screenshotsFilename = `${Date.now()}.png`;
    const screenshotsPath = join(screenshotsDir, screenshotsFilename);
    ffmpeg(fs.createReadStream(path))
      .on('end', () => {
        console.log('Screenshots taken');
      })
      .screenshots({
        count: 1,
        folder: screenshotsDir,
        filename: screenshotsFilename,
        timemarks: ['1'],
        size: '320x240',
      });
    return { message: 'Video uploaded successfully' };
  }
}
