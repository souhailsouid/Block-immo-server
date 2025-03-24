import { Injectable } from '@nestjs/common';
import { NoticeLetterData, FormattedNoticeLetterData } from '../interfaces/notice-letter.interface';
import { BaseLetterService } from './base-letter.service';
import { TemplateService } from './template.service';
import { ValidationService } from './validation.service';
import { LetterType } from '../interfaces/letter.interface';
import { FileService } from './file.service';

@Injectable()
export class NoticeLetterService extends BaseLetterService {
  constructor(
    protected readonly fileService: FileService,
    private readonly templateService: TemplateService,
    private readonly validationService: ValidationService,
  ) {
    super(fileService);
  }

  private getDefaultData(letterData: NoticeLetterData): FormattedNoticeLetterData {
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
      deliveryType: letterData.deliveryType,
      movingDate: this.formatDateToFrench(letterData.movingDate),
      isTightZone: letterData.isTightZone
    };
  }

  async generateLetter(userId: string, letterData: NoticeLetterData): Promise<string> {
    this.validationService.validateNoticeLetterData(letterData);
    const formattedData = this.getDefaultData(letterData);

    const htmlContent = this.templateService.generateNoticeLetterHTML(formattedData);
    return await this.generatePDF(userId, htmlContent, LetterType.NOTICE);
  }
} 