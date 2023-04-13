import { Module } from '@nestjs/common';
import { IvaModule } from './iva/iva.module';

@Module({
  imports: [IvaModule],
})
export class TaxesModule {}
