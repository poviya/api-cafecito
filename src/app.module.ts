import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CountriesModule } from './modules/countries/countries.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MoneysModule } from './modules/moneys/moneys.module';
import { PostsModule } from './modules/posts/posts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { TaxesModule } from './modules/taxes/taxes.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { CoursesModule } from './modules/courses/courses.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CustomersModule } from './modules/customers/customers.module';
import { NotificationModule } from './modules/notifications/notifications.module';

//import LocalSession from 'telegraf-session-local';

//const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot(),

    // CLEVER CLOUD NUEVA CONEXION
    MongooseModule.forRoot(process.env.MONGODB_ADDON_URI, {
      useNewUrlParser: true,
      //connectionName: 'onlypu',
    }),
    /*
    MongooseModule.forRoot(process.env.MONGODB_ADDON_URI, {
      useNewUrlParser: true,
      connectionName: 'poviya',
    }),*/
    // MODULOS
    AuthModule,
    //EmpresasModule,
    UsersModule,
    CountriesModule,
    PostsModule,
    MoneysModule,
    // NotificationModule,
    // MessageWsModule,
    CommonModule,
    TaxesModule,
    SuppliersModule,
    CoursesModule,
    TransactionsModule,
    CustomersModule,
    NotificationModule,
    //OperacionesModule,
    //ProgramasModule,

    // TelegrafModule.forRoot({
    //   //middlewares: [sessions.middleware()],
    //   //token: '5492405324:AAE-l1YGXW-bL5l6Q7dFJcveqoW9vQjtbDg',
    //   token: '5926043700:AAEviiKMheXeIH13k9T8NUzII_OvfwqtXVY',
    //   //botName: 'onlypuTestBot',
    // }),
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
