import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:id')
  async getUserProfile(@Req() req: Request) {
    const user = req['user'];
    return this.userService.getUserProfile(user.uid);
  }

  @UseGuards(AuthGuard('firebase'))
  @Put('profile/:id')
  async updateUserProfile(@Req() req: Request, @Body() body: any) {
    const user = req['user'];
    return this.userService.updateUserProfile(user.uid, user.email, body);
  }
}
