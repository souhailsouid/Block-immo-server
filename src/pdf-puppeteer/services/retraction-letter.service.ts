import { Injectable } from '@nestjs/common';
import { RetractionLetterData, FormattedRetractionLetterData } from '../interfaces/retraction-letter.interface';
import { BaseLetterService } from './base-letter.service';
import { TemplateService } from './template.service';
import { ValidationService } from './validation.service';
import { LetterType } from '../interfaces/letter.interface';
import { FileService } from './file.service';

@Injectable()
export class RetractionLetterService extends BaseLetterService {
  constructor(
    protected readonly fileService: FileService,
    private readonly templateService: TemplateService,
    private readonly validationService: ValidationService,
  ) {
    super(fileService);
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
      gender: letterData.gender,
      contractReference: letterData.contractReference,
      loanType: letterData.loanType,
      loanDuration: letterData.loanDuration,
      amount: letterData.amount,
      contractDate: this.formatDateToFrench(letterData.contractDate)
    };
  }

  async generateLetter(userId: string, letterData: RetractionLetterData): Promise<string> {
    this.validationService.validateRetractionLetterData(letterData);
    const formattedData = this.getDefaultData(letterData);

    const htmlContent = this.templateService.generateRetractionLetterHTML(formattedData);
    return await this.generatePDF(userId, htmlContent, LetterType.RETRACTION);
  }
} 