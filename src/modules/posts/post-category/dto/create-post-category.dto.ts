import { IsOptional, IsString } from 'class-validator';

export class CreatePostCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug: string;
}
