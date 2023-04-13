import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountryModule } from 'src/modules/countries/country/country.module';
import { Supplier, SupplierSchema } from './entities/supplier.entity';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  controllers: [SupplierController],
  imports: [
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
    ]),
    forwardRef(() => CountryModule),
  ],
  exports: [MongooseModule],
  providers: [SupplierService],
})
export class SupplierModule {}
