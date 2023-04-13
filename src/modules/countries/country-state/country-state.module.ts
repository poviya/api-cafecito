import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CountryState,
  CountryStateSchema,
} from './entities/country-state.entity';
import { CountryStateService } from './country-state.service';
import { CountryStateController } from './country-state.controller';
import { CountryModule } from '../country/country.module';

@Module({
  controllers: [CountryStateController],
  providers: [CountryStateService],
  imports: [
    MongooseModule.forFeature([
      { name: CountryState.name, schema: CountryStateSchema },
    ]),
    CountryModule,
  ],
  exports: [MongooseModule],
})
export class CountryStateModule {}
