import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PersonalModule } from './personal/personal.module';
import { UserCollectionModule } from './user-collection/user-collection.module';
import { UserTransferModule } from './user-transfer/user-transfer.module';

@Module({
  imports: [
    UserModule,
    PersonalModule,
    UserCollectionModule,
    UserTransferModule,
  ],
})
export class UsersModule {}
