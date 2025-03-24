import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { FileService } from './file.service';
import { LetterType } from '../interfaces/letter.interface';

@Injectable()
export abstract class BaseLetterService {
  constructor(
    protected readonly fileService: FileService,
  ) {}

  protected formatDateToFrench(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  }

  protected async generatePDF(userId: string, htmlContent: string, type: LetterType): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(htmlContent);

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      return await this.fileService.savePdfToStorage(userId, Buffer.from(pdfBuffer), type);
    } finally {
      await browser.close();
    }
  }

  abstract generateLetter(userId: string, data: any): Promise<string>;
} 