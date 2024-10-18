import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),

      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  async setCustomClaims(uid: string, claims: object): Promise<void> {
    this.logger.log(`Received UID: ${uid}, Claims: ${JSON.stringify(claims)}`);
    if (!uid || uid.length > 128) {
      throw new Error(
        'The uid must be a non-empty string with at most 128 characters.',
      );
    }
    await admin.auth().setCustomUserClaims(uid, claims);
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      const user = await admin.auth().getUser(uid);
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with UID ${uid}`, error.stack);
      throw error;
    }
  }

  async generateJwt(payload: any): Promise<string> {
    try {
      return this.jwtService.sign(payload);
    } catch (error) {
      this.logger.error(`Error generating JWT`, error.stack);
      throw error;
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.error(`Invalid JWT token`, error.stack);
      throw error;
    }
  }

  async getCustomClaims(uid: string): Promise<any> {
    try {
      const user = await admin.auth().getUser(uid);
      return user.customClaims || {};
    } catch (error) {
      this.logger.error(
        `Error fetching custom claims for user ${uid}`,
        error.stack,
      );
      throw error;
    }
  }
}
