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
import { PaymentOrder } from './entities/payment-order.entity';
import { PaymentOrderService } from './payment-order.service';
import { CreateProductPaymentOrderDto } from './dto/index.dto';

@Controller('payment-order')
export class PaymentOrderController {
  constructor(private readonly paymentOrderService: PaymentOrderService) {}

  @Post('create-product')
  async createProduct(@Body() dataDto: CreateProductPaymentOrderDto) {
    const res = await this.paymentOrderService.createProduct(dataDto);
    return res;
  }

  @Post('create-course')
  async createCourse(@Body() dataDto: any, @CurrentUser() user: any) {
    dataDto.User = await user;
    const res = await this.paymentOrderService.createCourse(dataDto);
    return res;
  }

  @Put('codeCollection/:id')
  async updateOne(
    @Param('codeCollection') codeCollection: any,
    @Body() dataDto: any,
  ) {
    const res = await this.paymentOrderService.updateOne(
      codeCollection,
      dataDto,
    );
    return res;
  }

  @Post('transaction')
  async transaction(@Body() dataDto: any) {
    const res = await this.paymentOrderService.transaction(dataDto);
    return res;
  }

  @Get()
  async findAll(): Promise<PaymentOrder[]> {
    return this.paymentOrderService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PaymentOrder> {
    return this.paymentOrderService.findById(id);
  }

  @Get('codeCollection/:id')
  async findOneCodeCollection(@Param('id') id: string): Promise<PaymentOrder> {
    return this.paymentOrderService.findOneCodeCollection(id);
  }

  @Get('notification/:id')
  async notification(@Param('id') id: string): Promise<PaymentOrder> {
    return this.paymentOrderService.notification(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    return this.paymentOrderService.remove(id);
  }
}
