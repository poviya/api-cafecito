import { PartialType } from '@nestjs/swagger';
import { CreateUserCollectionDto } from './create-user-collection.dto';

export class UpdateUserCollectionDto extends PartialType(CreateUserCollectionDto) {}
