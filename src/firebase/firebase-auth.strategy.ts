import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase') {
  async validate(req: any): Promise<any> {
    const token = req.headers.authorization?.split('Bearer ')[1];  
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);  
      return decodedToken; 
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
