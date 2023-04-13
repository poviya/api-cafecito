import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CountryState,
  CountryStateSchema,
} from '../country-state/entities/country-state.entity';
import { Country, CountrySchema } from '../country/entities/country.entity';
import { StateCity, StateCitySchema } from './entities/state-city.entity';
import { StateCityController } from './state-city.controller';
import { StateCityService } from './state-city.service';

@Module({
  controllers: [StateCityController],
  providers: [StateCityService],
  imports: [
    MongooseModule.forFeature([
      { name: StateCity.name, schema: StateCitySchema },
      { name: CountryState.name, schema: CountryStateSchema },
      { name: Country.name, schema: CountrySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class StateCityModule {}
