import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id/parse-mongo-id.pipe';
import { CurrentUser } from 'src/modules/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { fileFilter } from 'src/modules/posts/post-media/helpers';
import { PostMediaService } from 'src/modules/posts/post-media/post-media.service';
import { EmailDto, SlugDto, UsernameDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  // CONSTRUCTOR
  constructor(
    private userServicie: UserService,
    private postMediaService: PostMediaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-cover')
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: fileFilter,
    }),
  )
  async createCover(
    @Body() dataDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: any,
  ) {
    if (!files) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    const createDto = JSON.parse(dataDto.data);
    const res = this.userServicie.createCover(createDto, files, user);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-profile')
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: fileFilter,
    }),
  )
  async createProfile(
    @Body() dataDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: any,
  ) {
    if (!files) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    const createDto = JSON.parse(dataDto.data);
    const res = this.userServicie.createProfile(createDto, files, user);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateUser(
    @Res() res: any,
    @Body() dataDTO: any,
    @CurrentUser() user: any,
  ) {
    //dataDTO.User = await user;
    const objectData = await this.userServicie.update(user._id, dataDTO);
    return res.status(HttpStatus.OK).json(objectData);
  }

  @Post('update/images')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/image')
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: fileFilter,
    }),
  )
  async updateWithImage(
    @Res() res: any,
    @Body() dataDTO: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: any,
  ) {
    if (!files) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    //const createDto = JSON.parse(dataDTO.data);
    //createDto.User = await user;

    const createDto = JSON.parse(dataDTO.data);

    createDto.User = await user;
    await this.userServicie.update(user._id, createDto);
    const objectUpdate = await this.postMediaService.createProfile(user, files);

    //const object = dataDTO;
    return res.status(HttpStatus.OK).json(objectUpdate);
  }

  // CREAR
  @Post('/')
  async crear(@Res() res: any, @Body() data: any) {
    data.email = data.email;
    const object = await this.userServicie.doestEmailExists(data);

    if (!object) {
      const objeto = await this.userServicie.create(data);
      return res.status(HttpStatus.OK).json(objeto);
    } else {
      const object = {
        useExists: true,
      };
      return res.status(HttpStatus.OK).json(object);
    }
  }

  // CAMBIAR CLAVE
  @Post('/cambiarclave')
  async cambiarClave(
    @Res() res: any,
    @Body() datos: any,
    @CurrentUser() user: any,
  ) {
    const objeto = await this.userServicie.cambiarClave(datos, user);
    return res.status(HttpStatus.OK).json({
      mensaje: 'Respuesta, exitosamente',
      objeto,
    });
  }

  // OBTENER
  @Get('/')
  async obtener(@Res() res: any) {
    const lista = await this.userServicie.obtenerTodos();
    return res.status(HttpStatus.OK).json(lista);
  }

  // OBTENER
  @Get('/informacion')
  async obtenerInformacion(@Res() res: any, @CurrentUser() usuario: any) {
    const objeto = await this.userServicie.obtenerInformacion(usuario);
    return res.status(HttpStatus.OK).json({
      mensaje: 'Respuesta, exitosamente',
      objeto,
    });
  }

  // DATOS
  @Get('/datos')
  async datos(@Res() res: any) {
    // const idUsuario = this.jwtService.decode()
    const lista = await this.userServicie.obtenerTodos();
    return res.status(HttpStatus.OK).json({
      mensaje: 'Lista desplegada, exitosamente',
      lista,
    });
  }

  @Get('/:id')
  async findOne(@Param('id', ParseMongoIdPipe) id: string) {
    const res = await this.userServicie.findOne(id);
    return res;
  }

  // ELIMINAR
  @Delete('/')
  async eliminar(@Query('id') ID: any) {
    const res = await this.userServicie.remove(ID);
    return res;
  }

  // EDITAR
  @Put('/:ID')
  async update(@Res() res: any, @Param('ID') ID: any, @Body() dataDto: any) {
    const object = await this.userServicie.update(ID, dataDto);
    return res.status(HttpStatus.OK).json(object);
  }

  @Post('/user-exist')
  async obtenerConsulta(@Res() res: any, @Body() data: any) {
    const lista = await this.userServicie.doestEmailExists(data);
    return res.status(HttpStatus.OK).json(lista);
  }

  @Post('slug')
  async userSlug(@Body() data: SlugDto) {
    const object = await this.userServicie.slug(data);
    return object; //res.status(HttpStatus.OK).json(object);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update-username')
  async updateUsername(@CurrentUser() user: any, @Body() dataDto: UsernameDto) {
    const object = await this.userServicie.updateUsername(dataDto, user);
    return object;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update-email')
  async updateEmail(@CurrentUser() user: any, @Body() dataDto: EmailDto) {
    const object = await this.userServicie.updateEmail(dataDto, user);
    return object;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/username-email')
  async updateUsernameeEmail(
    @Res() res: any,
    @CurrentUser() user: any,
    @Body() dataDto: any,
  ) {
    if (dataDto.username) {
      const object = await this.userServicie.doestUsernameExists(dataDto);
      if (!object) {
        await this.userServicie.update(user._id, dataDto);
        return res.status(HttpStatus.OK).json(object);
      } else {
        return res.status(HttpStatus.OK).json(object);
      }
    } else if (dataDto.email) {
      const object = await this.userServicie.doestEmailExists(dataDto);
      if (!object) {
        await this.userServicie.update(user._id, dataDto);
        return res.status(HttpStatus.OK).json(object);
      } else {
        return res.status(HttpStatus.OK).json(object);
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/get/all/users/distinct/current')
  async getAllUsersDistinctCurrent(
    @Query() paginationDto: any,
    @Res() res: any,
    @CurrentUser() user: any,
    @Body() dataDto: any,
  ) {
    console.log('hello', dataDto);
    dataDto.User = await user;
    const lista = await this.userServicie.getAllUsersDistinctCurrent(
      dataDto,
      paginationDto,
    );
    return res.status(HttpStatus.OK).json(lista);
  }

  @Post('/arrangement')
  async arrangement() {
    const res = await this.userServicie.arrangement();
    return res;
  }

  @Post('update/notificationToken')
  async updateNotificationToken(@Body() dataDTO: any) {
    const objectData = await this.userServicie.updateNotificationToken(dataDTO);
    return objectData;
  }
}
