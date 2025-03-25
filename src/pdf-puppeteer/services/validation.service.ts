import { Injectable, BadRequestException } from '@nestjs/common';
import { RetractionLetterData } from '../interfaces/retraction-letter.interface';

@Injectable()
export class ValidationService {
  validateRetractionLetterData(letterData: RetractionLetterData): void {
    if (!letterData.gender) {
      throw new BadRequestException('Le champ gender est obligatoire et doit être "M" ou "F"');
    }

    if (!['M', 'F'].includes(letterData.gender)) {
      throw new BadRequestException('Le champ gender doit être "M" ou "F"');
    }

    if (!letterData.location) {
      throw new BadRequestException('Le lieu est obligatoire');
    }

    if (!letterData.date) {
      throw new BadRequestException('La date est obligatoire');
    }

    if (!letterData.senderName) {
      throw new BadRequestException('Le nom et prénom de l\'expéditeur sont obligatoires');
    }

    if (!letterData.recipientName) {
      throw new BadRequestException('Le nom du destinataire est obligatoire');
    }

    if (!letterData.amount) {
      throw new BadRequestException('Le montant est obligatoire');
    }

    try {
      new Date(letterData.date);
    } catch (error) {
      throw new BadRequestException('Le format de la date est invalide');
    }
  }
} 