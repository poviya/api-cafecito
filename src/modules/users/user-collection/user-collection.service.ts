import { Injectable } from '@nestjs/common';
import { CreateUserCollectionDto } from './dto/create-user-collection.dto';
import { UpdateUserCollectionDto } from './dto/update-user-collection.dto';

@Injectable()
export class UserCollectionService {
  create(createUserCollectionDto: CreateUserCollectionDto) {
    return 'This action adds a new userCollection';
  }

  findAll() {
    return `This action returns all userCollection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userCollection`;
  }

  update(id: number, updateUserCollectionDto: UpdateUserCollectionDto) {
    return `This action updates a #${id} userCollection`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCollection`;
  }
}
