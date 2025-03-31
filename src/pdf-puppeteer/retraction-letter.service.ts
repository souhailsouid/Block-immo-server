import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { RetractionLetterData, FormattedRetractionLetterData, FileMetadata } from './interfaces/retraction-letter.interface';
import { FileService } from './services/file.service';
import { TemplateService } from './services/template.service';
import { ValidationService } from './services/validation.service';
import { LetterType } from './interfaces/letter.interface';

@Injectable()
export class RetractionLetterService {
  constructor(
    private readonly fileService: FileService,
    private readonly templateService: TemplateService,
    private readonly validationService: ValidationService,
  ) {}

  private formatDateToFrench(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  }

  private getDefaultData(letterData: RetractionLetterData): FormattedRetractionLetterData {
    const today = new Date();
    return {
      senderName: letterData.senderName,
      senderAddress: letterData.senderAddress,
      senderPostalCode: letterData.senderPostalCode,
      senderCity: letterData.senderCity,
      senderPhone: letterData.senderPhone || 'Non spécifié',
      senderEmail: letterData.senderEmail || 'Non spécifié',
      recipientName: letterData.recipientName,
      recipientAddress: letterData.recipientAddress,
      recipientPhone: letterData.recipientPhone || 'Non spécifié',
      recipientEmail: letterData.recipientEmail || 'Non spécifié',
      location: letterData.location,
      date: this.formatDateToFrench(letterData.date),
      amount: letterData.amount,
      contractDate: this.formatDateToFrench(letterData.contractDate || today.toISOString()),
      contractReference: letterData.contractReference || 'Non spécifié',
      loanType: letterData.loanType || 'Crédit à la consommation',
      loanDuration: letterData.loanDuration || 'Non spécifié',
      gender: letterData.gender
    };
  }

  async generateRetractionLetter(userId: string, letterData: RetractionLetterData): Promise<{ signedUrl: string; metadata: FileMetadata }> {
    this.validationService.validateRetractionLetterData(letterData);
    const formattedData = this.getDefaultData(letterData);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });

      const htmlContent = this.templateService.generateRetractionLetterHTML(formattedData);
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

      const { signedUrl, metadata } = await this.fileService.savePdfToStorage(userId, Buffer.from(pdfBuffer), 'RETRACTION_LETTER' as LetterType);
      return { signedUrl, metadata };
    } finally {
      await browser.close();
    }
  }
} 