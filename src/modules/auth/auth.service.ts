import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from '../users/user/entities/user.entity';
import { UserService } from '../users/user/user.service';
import {
  templateConfirmEmailCafecitoEs,
  templateConfirmEmailCafecitoEn,
  configNodemailer,
  transporterNodemailerOnlypu,
} from 'src/common/constants';
import { CountryStateController } from '../countries/country-state/country-state.controller';
import { AuthUserDto, EmailVerifiedDto } from './dto/authUser.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('UserService');
  // CONSTRUCTOR
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /*     
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    */

  async validateUser(
    username: string,
    pass: string,
    site: string,
  ): Promise<any> {
    // console.log('Validando: ', username);
    const user: any = await this.usersService.getByUser(username, site);
    if (user && user.password === pass) {
      // return {
      //   _id: user._id,
      //   username: user.username,
      //   email: user.email,
      //   name: user.name,
      //   lastname: user.lastname,
      //   Site: user.Site,
      //   //Country: user.Country,
      //   Profile: user.Profile,
      //   phone: user.phone,
      //   //Cover: user.Cover,
      //   //Empresa: user.Empresa,
      // };
      return user;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    // const payload = { username: user.username, sub: user.userId };
    const resp = await this.validateUser(
      user.username,
      user.password,
      user.Site,
    );
    if (resp) {
      const payload = {
        //username: user.username,
        sub: resp,
        //Empresa: user.Empresa,
      };
      return {
        ok: true,
        data: {
          user: payload.sub,
          access_token: this.jwtService.sign(payload),
        },
        message: 'Exitosamente..!',
      };
    } else {
      return {
        ok: false,
        data: {},
        message: 'Error',
      };
    }
  }

  // CREAR
  async create(dataDTO: any): Promise<any> {
    try {
      dataDTO.username = await this.generateSlug();
      const code = Math.round(Math.random() * (999999 - 100000) + 100000);
      dataDTO.codeVerified = code;
      const userCreate = await this.userModel.create(dataDTO);
      const user = await this.userModel
        .findOne({
          _id: userCreate._id,
        })
        .populate('Cover')
        .populate('Profile')
        .exec();
      const payload = {
        //username: user.username,
        sub: user,
      };
      // send confirm email
      this.sendConfirmEmail(user);
      return {
        ok: true,
        data: {
          user: payload.sub,
          access_token: this.jwtService.sign(payload),
        },
        message: 'Se creo correctamente',
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async sendConfirmEmail(user: any) {
    //const testAccount = await this.nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = transporterNodemailerOnlypu();

    return transporter.sendMail(
      {
        from: `"Support / Cafecito.com" <${configNodemailer.poviya.auth.user}>`, // sender address
        to: `${user.email}`, // list of receivers
        subject: 'Confirm mail', // Subject line ES, EN
        html: templateConfirmEmailCafecitoEn(user.codeVerified), // html body
      },
      (error) => {
        if (error) {
          console.log('email no enviado');
          return false; //response.status(500).send(error.message);
        } else {
          console.log('Enviado');
          return true;
        }
      },
    );
  }

  async verifiedAccount(dataDto: EmailVerifiedDto, user: AuthUserDto) {
    try {
      const objectUser = await this.userModel
        .findOne({
          _id: user._id,
        })
        .exec();
      if (objectUser) {
        if (dataDto.codeVerified == objectUser.codeVerified) {
          await this.userModel.updateOne(
            { _id: objectUser._id },
            {
              emailVerified: true,
              codeVerified: 0,
            },
            {
              new: true,
            },
          );
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
          };
        }
      } else {
        return {
          ok: false,
        };
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async sendCodeEmail(user: AuthUserDto) {
    const code = Math.round(Math.random() * (999999 - 100000) + 100000);
    const res = await this.userModel
      .findByIdAndUpdate(
        user._id,
        {
          codeVerified: code,
        },
        {
          new: true,
        },
      )
      .populate('Cover')
      .populate('Profile')
      .exec();
    this.sendConfirmEmail(res);
    return res;
  }

  usuario() {
    // return this.jwtService.decode()
  }

  async doestEmailExists(dataDTO: User): Promise<any> {
    const user = await this.userModel.findOne({ email: dataDTO.email });
    if (user) {
      return true;
    }
    return false;
  }

  async doestUsernameExists(dataDto: any): Promise<any> {
    const user = await this.userModel.findOne({ username: dataDto.username });
    if (user) {
      return true;
    }
    return false;
  }

  async generateSlug() {
    const slug = 'user-' + new Date().getTime();
    return slug;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
