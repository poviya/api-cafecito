import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserCollectionService } from './user-collection.service';
import { CreateUserCollectionDto } from './dto/create-user-collection.dto';
import { UpdateUserCollectionDto } from './dto/update-user-collection.dto';

@Controller('user-collection')
export class UserCollectionController {
  constructor(private readonly userCollectionService: UserCollectionService) {}

  @Post()
  create(@Body() createUserCollectionDto: CreateUserCollectionDto) {
    return this.userCollectionService.create(createUserCollectionDto);
  }

  @Get()
  findAll() {
    return this.userCollectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCollectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserCollectionDto: UpdateUserCollectionDto) {
    return this.userCollectionService.update(+id, updateUserCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCollectionService.remove(+id);
  }
}
