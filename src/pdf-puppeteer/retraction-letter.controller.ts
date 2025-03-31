import { Controller, Post, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { RetractionLetterService } from './retraction-letter.service';
import { AuthGuard } from '@nestjs/passport';

interface RetractionLetterData {
  senderName: string;
  senderAddress: string;
  senderPostalCode: string;
  senderCity: string;
  senderPhone?: string;
  senderEmail?: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone?: string;
  recipientEmail?: string;
  location: string;
  date: string;
  amount: string;
  contractDate?: string;
  contractReference?: string;
  loanType?: string;
  loanDuration?: string;
  gender: 'M' | 'F';
}

@Controller('retraction-letter')
export class RetractionLetterController {
  constructor(private readonly retractionLetterService: RetractionLetterService) {}

  @UseGuards(AuthGuard('firebase'))
  @Post('generate/:userId')
  async generateRetractionLetter(@Param('userId') userId: string, @Body() letterData: RetractionLetterData) {
    if (!letterData.gender) {
      throw new BadRequestException('Le champ gender est obligatoire et doit être "M" ou "F"');
    }

    if (!['M', 'F'].includes(letterData.gender)) {
      throw new BadRequestException('Le champ gender doit être "M" ou "F"');
    }

    const { signedUrl, metadata } = await this.retractionLetterService.generateRetractionLetter(userId, letterData);
    return { signedUrl, metadata };
  }
} 