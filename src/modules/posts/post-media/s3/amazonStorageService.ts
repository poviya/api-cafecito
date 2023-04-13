import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as AWS from 'aws-sdk';
import { Model } from 'mongoose';
import { PostMedia } from '../entities/post-media.entity';
import * as watermark from 'jimp-watermark';

@Injectable()
export class AmazonStorageService {
  //watermark = require('jimp-watermark');
  AWS_BUCKET = process.env.AWS_BUCKET;
  // FOLDER = 'fanspi/post';
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  constructor(
    @InjectModel(PostMedia.name)
    private postMediaModel: Model<PostMedia>,
  ) {}
  //// S3
  async uploadFileBase64(base64, FOLDER) {
    const base64Data = Buffer.from(
      base64.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    // Getting the file type, ie: jpeg, png or gif
    const type = base64.split(';')[0].split('/')[1];

    // With this setup, each time your user uploads an image, will be overwritten.
    // To prevent this, use a different Key each time.
    // This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
    const params = {
      Bucket: this.AWS_BUCKET,
      Key: `${FOLDER}/${this.generateRandomString(15)}.`,
      Body: base64Data,
      ACL: 'public-read',
      ContentEncoding: 'base64', /// required
      ContentType: `image/${type}`, // required. Notice the back ticks
    };

    // The upload() is used instead of putObject() as we'd need the location url and assign that to our user profile/database
    // see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
    let location = '';
    let key = '';
    try {
      const { Location, Key } = await this.s3.upload(params).promise();
      location = Location;
      key = Key;
    } catch (error) {
      // console.log(error)
    }

    // Save the Location (url) to your database and Key if needs be.
    // As good developers, we should return the url and let other function do the saving to database etc
    console.log(location, key);

    return location;
  }

  async uploadFileN(file, FOLDER) {
    const logo = 'https://onlypu.com/assets/logo/logo.png';
    watermark
      .addWatermark(file, logo)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    return null;
  }

  //main().then((image) => image.write(FILENAME));

  async uploadFile(file, FOLDER) {
    console.log('entrando');
    const { originalname } = file;
    const response = await this.s3Upload(
      file.buffer,
      this.AWS_BUCKET,
      originalname,
      file.mimetype,
      FOLDER,
    );
    console.log('volviendo');
    return response;
  }

  async uploadFileMultiple(files, FOLDER) {
    //console.log(files);
    for (const file of files) {
      //console.log(file);
      const { originalname } = file;
      const response = await this.s3Upload(
        file.buffer,
        this.AWS_BUCKET,
        originalname,
        file.mimetype,
        FOLDER,
      );
      console.log(response);
    }
  }

  async s3Upload(file, bucket, name, mimetype, FOLDER) {
    //console.log(name);
    const params = {
      Bucket: bucket,
      Key: `${FOLDER}/${this.generateRandomString(15)}.` + name.split('.')[1],
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_DEFAULT_REGION,
      },
      /*Resize: {
                width: 50,
                height: 50,
            }*/
    };

    //console.log(params);

    try {
      const s3Response = await this.s3.upload(params).promise();

      //console.log(s3Response);
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async s3Delete(filename) {
    try {
      await this.s3
        .deleteObject({ Bucket: this.AWS_BUCKET, Key: filename })
        .promise();
      return { success: true, data: 'File deleted Successfully' };
    } catch (error) {
      return { success: false, data: null };
    }
  }
  generateRandomString(num) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result + Date.now();
  }

  // async imageWatermark(file: any) {
  //   return await watermark
  //     .addWatermark(file, 'https://onlypu.com/assets/logo/logo.png')
  //     .promise();
  //   // this.watermark
  //   //   .addWatermark('./img/main.jpg', 'https://onlypu.com/assets/logo/logo.png')
  //   //   .then((data) => {
  //   //     console.log(data);
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log(err);
  //   //   });
  // }
}
