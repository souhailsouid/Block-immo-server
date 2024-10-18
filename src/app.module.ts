import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseAuthMiddleware } from 'src/middleware/firebase-auth.middleware';
import { StorageModule } from './storage/storage.module';
import { PDFStorageModule } from './pdf-storage/pdf.module';
@Module({
  imports: [AuthModule, UserModule, StorageModule, PDFStorageModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseAuthMiddleware)
      .forRoutes(
        { path: 'storage/upload', method: RequestMethod.POST },
        { path: 'storage/file/:filename', method: RequestMethod.GET },
        { path: 'storage/user-files', method: RequestMethod.GET },
        { path: 'user/profile/:id', method: RequestMethod.GET },
        { path: 'user/profile/:id', method: RequestMethod.PUT },
      );
  }
}
