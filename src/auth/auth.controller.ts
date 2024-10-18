import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('set-custom-claims/:uid')
  async setCustomClaims(@Param('uid') uid: string, @Body() claims: any) {
    this.logger.log(`Setting custom claims for user ${uid}`);
    if (!uid) {
      throw new Error('UID est requis');
    }

    if (!claims || typeof claims !== 'object') {
      throw new Error('Les claims doivent être un objet');
    }
    await this.authService.setCustomClaims(uid, claims);
    return { message: 'Custom claims updated successfully' };
  }

  @Get('get-user/:uid')
  async getUser(@Param('uid') uid: string) {
    return this.authService.getUser(uid);
  }

  @Get('get-claims/:uid')
  async getCustomClaims(@Param('uid') uid: string) {
    return this.authService.getCustomClaims(uid);
  }
}
