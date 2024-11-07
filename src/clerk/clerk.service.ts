import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { createClerkClient } from '@clerk/express';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});
dotenv.config();

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(ClerkService.name);

  async getClerkUser(userId: string): Promise<any> {
    try {
      const user = await clerkClient.users.getUser(userId);
      return user;
    } catch (error) {
      this.logger.error(
        `Error fetching Clerk user with ID ${userId}`,
        error.stack,
      );
      throw error;
    }
  }
  

}
