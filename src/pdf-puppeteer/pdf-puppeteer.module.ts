import { Module } from '@nestjs/common';
import { PDFPuppeteerService } from './pdf-puppeteer.service';
import { PDFPuppeteerController } from './pdf-puppeteer.controller';
import { PreviewService } from './preview.service';
import { PreviewController } from './preview.controller';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';

@Module({
  controllers: [
    PDFPuppeteerController,
    PreviewController,
    ReceiptController
  ],
  providers: [
    PDFPuppeteerService,
    PreviewService,
    ReceiptService
  ],
  exports: [
    PDFPuppeteerService,
    PreviewService,
    ReceiptService
  ],
})
export class PDFPuppeteerModule {} 