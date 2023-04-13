import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { AuthService } from './modules/auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // LOGIN
  @UseGuards(LocalAuthGuard)
  @Post('ausdsdsdsdsdth/login')
  async login(@Request() req: any) {
    //return this.authService.login(req.user);
  }
  /*
   // LOGIN
   @UseGuards(LocalAuthGuard)
   @Post('auth/register')
   async register(@Request() req: any) {
     return this.authService.login(req.user);
   }
   */
  // PERFIL
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
