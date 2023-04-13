import { PartialType } from '@nestjs/swagger';
import { CreateUserTransferDto } from './create-user-transfer.dto';

export class UpdateUserTransferDto extends PartialType(CreateUserTransferDto) {}
