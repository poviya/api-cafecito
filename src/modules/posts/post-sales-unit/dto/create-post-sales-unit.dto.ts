import { IsOptional, IsString } from 'class-validator';

export class CreatePostSalesUnitDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug: string;
}
