import { Injectable, BadRequestException } from '@nestjs/common';
import { RetractionLetterData } from '../interfaces/retraction-letter.interface';
import { NoticeLetterData } from '../interfaces/notice-letter.interface';

@Injectable()
export class ValidationService {
  validateRetractionLetterData(letterData: RetractionLetterData): void {
    if (!letterData.gender) {
      throw new BadRequestException('Le genre est requis');
    }
    if (!['M', 'F'].includes(letterData.gender)) {
      throw new BadRequestException('Le genre doit être M ou F');
    }
    if (!letterData.location) {
      throw new BadRequestException('La localisation est requise');
    }
    if (!letterData.date) {
      throw new BadRequestException('La date est requise');
    }
    if (!letterData.senderName) {
      throw new BadRequestException('Le nom de l\'expéditeur est requis');
    }
    if (!letterData.recipientName) {
      throw new BadRequestException('Le nom du destinataire est requis');
    }
    if (!letterData.amount) {
      throw new BadRequestException('Le montant est requis');
    }
    if (!this.isValidDate(letterData.date)) {
      throw new BadRequestException('Format de date invalide');
    }
  }

  validateNoticeLetterData(letterData: NoticeLetterData): void {
    if (!letterData.gender) {
      throw new BadRequestException('Le genre est requis');
    }
    if (!['M', 'F'].includes(letterData.gender)) {
      throw new BadRequestException('Le genre doit être M ou F');
    }
    if (!letterData.location) {
      throw new BadRequestException('La localisation est requise');
    }
    if (!letterData.date) {
      throw new BadRequestException('La date est requise');
    }
    if (!letterData.senderName) {
      throw new BadRequestException('Le nom de l\'expéditeur est requis');
    }
    if (!letterData.recipientName) {
      throw new BadRequestException('Le nom du destinataire est requis');
    }
    if (!letterData.deliveryType) {
      throw new BadRequestException('Le type de remise du courrier est requis');
    }
    if (!letterData.movingDate) {
      throw new BadRequestException('La date de déménagement est requise');
    }
    if (!this.isValidDate(letterData.date)) {
      throw new BadRequestException('Format de date invalide');
    }
    if (!this.isValidDate(letterData.movingDate)) {
      throw new BadRequestException('Format de date de déménagement invalide');
    }
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
} 