import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PDFPuppeteerService } from './pdf-puppeteer.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('pdf-puppeteer')
export class PDFPuppeteerController {
  constructor(private readonly pdfPuppeteerService: PDFPuppeteerService) {}

  @UseGuards(AuthGuard('firebase'))
  @Post('generate/:userId')
  async generatePDF(@Param('userId') userId: string, @Body() receiptData: any) {
    const signedUrl = await this.pdfPuppeteerService.generatePDF(userId, receiptData);
    return { signedUrl };
  }
} 