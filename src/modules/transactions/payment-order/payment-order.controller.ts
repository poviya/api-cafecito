import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id/parse-mongo-id.pipe';
import { CurrentUser } from 'src/modules/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PaymentOrder } from './entities/payment-order.entity';
import { PaymentOrderService } from './payment-order.service';

@Controller('payment-order')
export class PaymentOrderController {
  constructor(private readonly paymentOrderService: PaymentOrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-product')
  async createProduct(@Body() dataDto: any, @CurrentUser() user: any) {
    dataDto.User = await user;
    const res = await this.paymentOrderService.createProduct(dataDto);
    return res;
  }

  @Post('create-course')
  async createCourse(@Body() dataDto: any, @CurrentUser() user: any) {
    dataDto.User = await user;
    const res = await this.paymentOrderService.createCourse(dataDto);
    return res;
  }

  @Put('/:id')
  async edit(@Res() res: any, @Param('id') id: any, @Body() dataDto: any) {
    const object = await this.paymentOrderService.edit(id, dataDto);
    if (!object) throw new NotFoundException('does not exist!');
    return res.status(HttpStatus.OK).json(object);
  }

  @Post('transaction')
  async transaction(@Body() dataDto: any) {
    const objectOne = await this.paymentOrderService.findOneCodeCollection(
      dataDto.receipt.req_reference_number,
    );
    if (!objectOne) {
      return {
        ok: false,
        data: {},
        message: 'No existe codigo de recaudacion',
      };
    }

    dataDto.paymentOrder = objectOne;
    let res: any;
    if (!res) {
      return {
        ok: false,
        data: objectOne,
        message: 'No existe transaccion',
      };
    }

    objectOne.receipt = dataDto.receipt;
    return {
      ok: true,
      data: objectOne,
      message: 'Exito en la transaccion',
    };
  }

  @Get()
  async findAll(): Promise<PaymentOrder[]> {
    return this.paymentOrderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PaymentOrder> {
    return this.paymentOrderService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    return this.paymentOrderService.remove(id);
  }
}
