import { Module } from '@nestjs/common';
import { PDFStorageService } from './pdf.service';
import { PDFStorageController } from './pdf.controller';

@Module({
  providers: [PDFStorageService],
  controllers: [PDFStorageController],
})
export class PDFStorageModule {}
