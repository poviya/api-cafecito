import { PartialType } from '@nestjs/swagger';
import { CreateIvaDto } from './create-iva.dto';

export class UpdateIvaDto extends PartialType(CreateIvaDto) {}
