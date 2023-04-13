import * as ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsMediaService {
  //constructor() {}
  async getVideoSnapshot(
    videoPath: string,
    snapshotPath: string,
    time: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg(videoPath).on('error', reject);
      // console.log(command);
      const snapshotStream = command
        .on('end', resolve)
        .screenshots({
          count: 1,
          filename: 'snapshotsdsdsdsdssdsdsd.png',
          folder: snapshotPath,
          size: '320x240',
          timestamps: [time],
        })
        .on('error', reject);
      console.log(snapshotStream);
      return;
      // Convert snapshotStream to a buffer and save it to a file
      const bufferChunks: Buffer[] = [];
      snapshotStream.on('data', (chunk: Buffer) => {
        bufferChunks.push(chunk);
      });
      snapshotStream.on('end', () => {
        const snapshotBuffer = Buffer.concat(bufferChunks);
        const writableStream = fs.createWriteStream(
          `${snapshotPath}/snapshot.png`,
        );
        const readableStream = new Readable({
          read() {
            this.push(snapshotBuffer);
            this.push(null);
          },
        });
        readableStream.pipe(writableStream);
      });
    });
  }
}
