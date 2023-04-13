import { forwardRef, Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Personal, PersonalSchema } from './entities/personal.entity';
import { UserModule } from '../user/user.module';
import { CountryModule } from 'src/modules/countries/country/country.module';

@Module({
  controllers: [PersonalController],
  imports: [
    MongooseModule.forFeature([
      { name: Personal.name, schema: PersonalSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => CountryModule),
  ],
  providers: [PersonalService],
})
export class PersonalModule {}
