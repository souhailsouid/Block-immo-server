import { Module } from '@nestjs/common';
import { FileService } from './storage.service';
import { FileController } from './storage.controller';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService], 
})
export class StorageModule {}
