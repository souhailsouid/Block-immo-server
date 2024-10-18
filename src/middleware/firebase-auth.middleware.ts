import { Injectable, NestMiddleware } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(403).send('Unauthorized');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req['user'] = decodedToken;  // Injecte l'utilisateur dans la requête
      next();
    } catch (error) {
      return res.status(401).send('Unauthorized');
    }
  }
}
