import { Controller, Post, Body, Logger, Get, Req } from '@nestjs/common';
import { ClerkService } from './clerk.service';

@Controller('clerk')
export class ClerkController {
  private readonly logger = new Logger(ClerkController.name);
  constructor(private readonly clerkService: ClerkService) {}

  @Get('user/:id')
  async getUserProfile(@Req() req: Request) {
    const userId = req['params'].id;
    return this.clerkService.getClerkUser(userId);
  }
}
