import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Headers,
  SetMetadata,
  Res,
  HttpStatus,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { PostMediaService } from '../posts/post-media/post-media.service';
//import { AuthGuard } from '@nestjs/passport';
//import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { AuthUserDto, EmailVerifiedDto } from './dto/authUser.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
//import { RawHeaders, GetUser, Auth } from './decorators';
//import { RoleProtected } from './decorators/role-protected.decorator';

//import { CreateUserDto, LoginUserDto } from './dto';
//import { User } from './entities/user.entity';
//import { UserRoleGuard } from './guards/user-role.guard';
//import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private postMediaService: PostMediaService,
  ) {}

  @Post('register')
  async createUser(@Res() res: any, @Body() data: any) {
    data.email = data.email;
    const object = await this.authService.doestEmailExists(data);

    if (!object) {
      const object = await this.authService.create(data);
      return res.status(HttpStatus.OK).json(object);
    } else {
      const object = {
        ok: false,
        data: {
          useExists: true,
        },
        message: 'Ya existe email',
      };
      return res.status(HttpStatus.OK).json(object);
    }
  }

  @Post('register-image')
  async createUserWithImage(@Res() res: any, @Body() data: any) {
    data.email = data.email;
    const object = await this.authService.doestEmailExists(data);

    if (!object) {
      const object = await this.authService.create(data);
      return res.status(HttpStatus.OK).json(object);
    } else {
      const object = {
        ok: false,
        data: {
          useExists: true,
        },
        message: 'Ya existe email',
      };
      return res.status(HttpStatus.OK).json(object);
    }
  }

  @Post('register-image')
  async updateUser(
    @Res() res: any,
    @Body() datadtoDTO: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: any,
  ) {
    if (!files) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    const createDto = JSON.parse(datadtoDTO.data);
    datadtoDTO.email = datadtoDTO.email;
    const object = await this.authService.doestEmailExists(datadtoDTO);
    if (!object) {
      const objectCreateData = await this.authService.create(datadtoDTO);
      this.postMediaService.createProfile(createDto, files);
      return res.status(HttpStatus.OK).json(objectCreateData);
    } else {
      const object = {
        ok: false,
        data: {
          useExists: true,
        },
        message: 'Ya existe email',
      };
      return res.status(HttpStatus.OK).json(object);
    }
  }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Body() loginUserDto: any) {
    const res = await this.authService.login(loginUserDto);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('verified-email')
  async verifiedAccount(
    @Body() dataDto: EmailVerifiedDto,
    @CurrentUser() user: AuthUserDto,
  ) {
    const res = await this.authService.verifiedAccount(dataDto, user);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/send-code-email')
  async sendCodeEmail(@CurrentUser() user: any) {
    const res = await this.authService.sendCodeEmail(user);
    return res;
  }

  /*
  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    //return this.authService.checkAuthStatus(user);
  }
  
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  // @SetMetadata('roles', ['admin','super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }*/
}
