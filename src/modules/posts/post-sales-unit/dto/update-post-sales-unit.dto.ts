import { PartialType } from '@nestjs/swagger';
import { CreatePostSalesUnitDto } from './create-post-sales-unit.dto';

export class UpdatePostSalesUnitDto extends PartialType(
  CreatePostSalesUnitDto,
) {}
