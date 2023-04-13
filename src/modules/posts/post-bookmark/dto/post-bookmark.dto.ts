import { IsMongoId } from 'class-validator';

export class CreatePostBookmarkDto {
  @IsMongoId()
  Post: string;
}
