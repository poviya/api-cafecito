import { Module, forwardRef } from '@nestjs/common';
import { UserTransferService } from './user-transfer.service';
import { UserTransferController } from './user-transfer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserTransfer,
  UserTransferSchema,
} from './entities/user-transfer.entity';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [UserTransferController],
  providers: [UserTransferService],
  imports: [
    MongooseModule.forFeature([
      { name: UserTransfer.name, schema: UserTransferSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  exports: [MongooseModule],
})
export class UserTransferModule {}
