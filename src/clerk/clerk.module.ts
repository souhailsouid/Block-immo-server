import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ClerkController } from './clerk.controller';
import { ClerkService } from './clerk.service';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [ClerkService],
  exports: [ClerkService],
  controllers: [ClerkController],
})
export class ClerkModule {}
