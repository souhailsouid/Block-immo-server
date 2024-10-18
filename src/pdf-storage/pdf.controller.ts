import { Controller, Post, Body, Param } from '@nestjs/common';
import { PDFStorageService } from './pdf.service';

@Controller('pdf')
export class PDFStorageController {
  constructor(private readonly pdfStorageService: PDFStorageService) {}

  
  @Post('generate/:userId')
  async generateAndStorePDF(@Param('userId') userId: string, @Body() receiptData: any) {
    const signedUrl = await this.pdfStorageService.generateAndStorePDF(userId, receiptData);
    return { signedUrl };
  }
  
}
