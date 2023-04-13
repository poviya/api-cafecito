import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { isValidObjectId, Model } from 'mongoose';
import { EmailDto, SlugDto, UsernameDto } from './dto/user.dto';
import { AuthUserDto } from 'src/modules/auth/dto/authUser.dto';

@Injectable()
export class UserService {
  // para manejar errores
  private readonly logger = new Logger('UserService');

  // CONSTRUCTOR si
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // CREAR
  async create(dataDTO: any): Promise<User> {
    try {
      dataDTO.username = await this.generateSlug();
      const res = await this.userModel.create(dataDTO);
      return res;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // OBTENER
  async obtenerTodos(): Promise<User[]> {
    const lista = await this.userModel.find().exec();
    return lista;
  }

  // OBTENER UNO

  async findOne(ID: string) {
    let res: User;

    if (isValidObjectId(ID)) {
      res = await this.userModel
        .findById(ID)
        .populate('Cover')
        .populate('Profile');
    }

    if (!res)
      throw new NotFoundException(`Id ${ID} not found`, {
        description: 'Not found',
      });
    return res;
  }

  // ELIMINAR
  async remove(ID: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: ID });
    if (deletedCount === 0)
      throw new BadRequestException(`Id "${ID}" not found`);

    return;
  }

  // EDITAR
  async update(ID: string, dataDTO: any) {
    const data = await this.findOne(ID);

    try {
      await data.updateOne(dataDTO);
      return {
        ...data.toJSON(),
        ...dataDTO,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateUsername(dataDto: UsernameDto, user: any) {
    dataDto.username = dataDto.username.trim();
    const resVerified = await this.userModel.findOne(
      { username: dataDto.username }, //{ _id: { $ne: dataDto.user._id } },
    );
    if (resVerified)
      throw new BadRequestException(`User ${dataDto.username} already exists`, {
        description: `Exists`,
      });

    const data = await this.findOne(user._id);

    try {
      await data.updateOne({
        username: dataDto.username,
      });
      return {
        ...data.toJSON(),
        username: dataDto.username,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateEmail(dataDto: EmailDto, user: any) {
    const resVerified = await this.userModel.findOne(
      { email: dataDto.email }, //{ _id: { $ne: dataDto.user._id } },
    );

    if (resVerified)
      throw new BadRequestException(`Email ${dataDto.email} already exists`, {
        description: `Exists`,
      });

    const data = await this.findOne(user._id);

    try {
      await data.updateOne({
        email: dataDto.email,
      });
      return {
        ...data.toJSON(),
        email: dataDto.email,
      };
      // send notification
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // NOTIFICATION TOKEN
  async slug(dataDto: SlugDto) {
    try {
      const res = await this.userModel
        .findOne({
          username: dataDto.username,
          Site: dataDto.Site,
        })
        .populate('Cover')
        .populate('Profile')
        .select({
          _id: 1,
          username: 1,
          email: 1,
          name: 1,
          lastname: 1,
          bio: 1,
        });
      if (!res)
        throw new NotFoundException(`Slug ${dataDto.username} not found`, {
          description: 'Not found',
        });
      return res;
    } catch (error) {
      //this.handleExceptions(error);
      throw new NotFoundException(`Slug ${dataDto.username} not found`, {
        description: 'Not found',
      });
    }
  }

  // NOTIFICATION TOKEN
  async updateNotificationToken(dataDto: any) {
    try {
      const res = await this.userModel.findByIdAndUpdate(
        dataDto.User,
        {
          notificationToken: dataDto.notificationToken,
        },
        {
          new: true,
        },
      );
      if (!res) {
        return {
          ok: false,
          data: {},
          message: 'No se actualizo!',
        };
      } else {
        return {
          ok: true,
          data: {},
          message: 'Se actualizo exitosamente',
        };
      }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // CAMBIAR CLAVE
  async cambiarClave(datos: any, usuario: any): Promise<any> {
    console.log('usuario: ', usuario);
    const editado = await this.userModel.updateOne(
      {
        _id: usuario.userId,
        password: datos.passwordActual,
      },
      {
        password: datos.passwordNuevo,
        clave: datos.passwordNuevo,
      },
      {
        new: true,
      },
    );
    return editado;
  }

  // OBTENER POR USUARIO
  async getByUser(user: any, site: any): Promise<User> {
    const objectUsername = await this.userModel
      .findOne({
        username: { $eq: user },
        Site: site,
        active: { $eq: true },
      })
      .populate('Cover')
      .populate('Profile')
      .select({
        _id: 1,
        username: 1,
        password: 1,
        email: 1,
        name: 1,
        lastname: 1,
        Site: 1,
        phone: 1,
        emailVerified: 1,
        // Empresa: 1,
      });
    if (!objectUsername) {
      const objectEmail = await this.userModel
        .findOne({
          Site: site,
          email: { $eq: user },
          active: { $eq: true },
        })
        .populate('Cover')
        .populate('Profile')
        .select({
          _id: 1,
          username: 1,
          password: 1,
          email: 1,
          name: 1,
          lastname: 1,
          Site: 1,
          phone: 1,
          emailVerified: 1,
          //Empresa: 1,
        });
      return objectEmail;
    } else {
      return objectUsername;
    }
  }

  // USUARIOS DISTINTO AL ACTUAL
  async getAllUsersDistinctCurrent(dataDTO: any, paginationDto): Promise<any> {
    const { limit = 10, offset = 0 } = paginationDto;
    const res = await this.userModel
      .find({
        Site: dataDTO.Site,
        _id: { $ne: dataDTO.User._id },
      })
      .populate('Cover')
      .populate('Profile')
      .populate('Country')
      .populate('StateCity')
      .limit(limit)
      .skip(offset)
      .sort({ planAt: -1 })
      //.select('-__v')
      //.sort({ plan: -1, planAt: -1 })
      .exec();
    if (!res) {
      return {
        ok: false,
        data: {},
        message: 'No hay datos!',
      };
    } else {
      return {
        ok: true,
        data: res,
        message: 'Peticion exitosamente',
      };
    }
  }

  // PRUEBA -----------------
  private readonly users = [
    {
      userId: 1,
      username: 'sandro',
      password: 'fafeda',
    },
    {
      userId: 2,
      username: 'sandra',
      password: 'surtimaxi',
    },
    {
      userId: 3,
      username: 'maria',
      password: 'guess',
    },
  ];
  /*
  async findOne(username: string): Promise<any | undefined> {
    return this.users.find((user) => user.username === username);
  }
  */
  // OBTENER
  async obtenerInformacion(usuario: any): Promise<User> {
    //console.log('usuario: ', usuario);
    const objeto = await this.userModel
      .findOne({ _id: { $eq: usuario.userId } })
      .select({ usuario: 1, Sucursal: 1, Almacen: 1 })
      .populate('Persona')
      .populate('Sucursal')
      .populate('Almacen')
      .exec();
    return objeto;
  }

  async arrangement(): Promise<any> {
    const list = await this.userModel.find();
    list.map(async (item) => {
      // if (!item.Site) {
      //   // let dataDto = {};
      //   // dataDto = {
      //   //   Site: '63932605aef66813e41204b4',
      //   // };
      //   // const res = await this.userModel.updateOne({ _id: item._id }, dataDto, {
      //   //   new: true,
      //   // });
      //   console.log(item.email);
      // }

      let dataDto = {};
      dataDto = {
        username: item.username.trim(),
      };
      await this.userModel.updateOne({ _id: item._id }, dataDto, {
        new: true,
      });
    });
    return true;
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

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    //console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
