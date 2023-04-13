import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';
import { CityZoneModule } from './city-zone/city-zone.module';
import { CountryStateModule } from './country-state/country-state.module';
import { StateCityModule } from './state-city/state-city.module';

@Module({
  imports: [CountryModule, CityZoneModule, CountryStateModule, StateCityModule],
})
export class CountriesModule {}
