import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from './entities/country.entity';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
  controllers: [CountryController],
  providers: [CountryService],
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
  ],
  exports: [MongooseModule, CountryService],
})
export class CountryModule {}
