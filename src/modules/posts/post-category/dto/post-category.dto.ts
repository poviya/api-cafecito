import { IsString } from 'class-validator';

export class FindOneSlugDto {
  @IsString()
  slug: string;
}
