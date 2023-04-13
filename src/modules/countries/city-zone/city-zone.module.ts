import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountryStateModule } from '../country-state/country-state.module';
import { CountryModule } from '../country/country.module';
import { StateCityModule } from '../state-city/state-city.module';
import { CityZoneController } from './city-zone.controller';
import { CityZoneService } from './city-zone.service';
import { CityZone, CityZoneSchema } from './entities/city-zone.entity';

@Module({
  controllers: [CityZoneController],
  providers: [CityZoneService],
  imports: [
    MongooseModule.forFeature([
      { name: CityZone.name, schema: CityZoneSchema },
    ]),
    CountryModule,
    StateCityModule,
    CountryStateModule,
  ],
  exports: [MongooseModule],
})
export class CityZoneModule {}
