import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

// ESTRATEGIAS
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

// CONSTANTES
import { jwtConstants } from './constants';

// SERVICIOS
import { AuthService } from './auth.service';

// MODULOS
import { AuthController } from './auth.controller';
import { PostMediaModule } from '../posts/post-media/post-media.module';
import { UserModule } from '../users/user/user.module';
//import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => PostMediaModule),
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    /*JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get(jwtConstants.secret));
        return {
          secret: configService.get(jwtConstants.secret),
        };
      },
    }),*/
    JwtModule.register({
      secret: jwtConstants.secret,
      //signOptions: { expiresIn: '43200s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
