import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserTransferService } from './user-transfer.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import {
  CreateLinkUserTransferDto,
  CreatePaypalUserTransferDto,
  UpdateLinkUserTransferDto,
  UpdatePaypalUserTransferDto,
} from './dto/user-transfer.dto';
import { CurrentUser } from 'src/modules/auth/current-user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/authUser.dto';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id/parse-mongo-id.pipe';

@Controller('user-transfer')
export class UserTransferController {
  constructor(private readonly UserTransferService: UserTransferService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-paypal')
  createPaypal(
    @CurrentUser() user: AuthUserDto,
    @Body() dataDto: CreatePaypalUserTransferDto,
  ) {
    return this.UserTransferService.createPaypal(dataDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-paypal/:id')
  updatePaypal(
    @CurrentUser() user: AuthUserDto,
    @Param('id') id: string,
    @Body() dataDto: UpdatePaypalUserTransferDto,
  ) {
    return this.UserTransferService.updatePaypal(id, dataDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-link')
  createLink(
    @CurrentUser() user: AuthUserDto,
    @Body() dataDto: CreateLinkUserTransferDto,
  ) {
    return this.UserTransferService.createLink(dataDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-link/:id')
  updateLink(
    @CurrentUser() user: AuthUserDto,
    @Param('id') id: string,
    @Body() dataDto: UpdateLinkUserTransferDto,
  ) {
    return this.UserTransferService.updateLink(id, dataDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findAllUser(@CurrentUser() user: AuthUserDto) {
    return this.UserTransferService.findAllUser(user);
  }

  @Get('all')
  findAll() {
    return this.UserTransferService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.UserTransferService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.UserTransferService.remove(id);
  }
}
