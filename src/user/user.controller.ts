import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('profile/:id')
  async getUserProfile(@Req() req: Request) {
    const user = req['user'];
    return this.userService.getUserProfile(user.uid);
  }

  @UseGuards(AuthGuard('firebase'))
  @Put('profile')
  async updateUserProfile(@Req() req: Request, @Body() body: any) {
    const user = req['user'];
    const updateProfile = await this.userService.updateUserProfile(
      user.uid,
      user.email,
      body,
    );

    return updateProfile;
  }

  @UseGuards(AuthGuard('firebase'))
  @Put('profile-with-role')
  async updateProfileWithRole(@Req() req: Request, @Body() body: any) {
    const user = req['user'];

    const { displayName, phone, address, email, role } = body;
    // Update profile information and set custom claims for role
    await this.userService.updateUserProfile(user.uid, user.email, {
      displayName,
      phone,
      address,
      email: user.email,
    });

    await this.authService.setCustomClaims(user.uid, { role });

    return {
      message: 'Profile and role updated successfully',
      data: { displayName, phone, address, role, email },
    };
  }
}
