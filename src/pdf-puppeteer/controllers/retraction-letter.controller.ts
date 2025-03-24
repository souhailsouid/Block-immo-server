import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RetractionLetterService } from '../services/retraction-letter.service';
import { RetractionLetterData } from '../interfaces/retraction-letter.interface';
import { AuthGuard } from '../guards/auth.guard';

@Controller('letters')
@UseGuards(AuthGuard)
export class RetractionLetterController {
  constructor(private readonly retractionLetterService: RetractionLetterService) {}

  @Post('retraction/:userId')
  async generateRetractionLetter(
    @Param('userId') userId: string,
    @Body() letterData: RetractionLetterData,
  ): Promise<string> {
    // Ensure all required fields are present
    if (!letterData.date) {
      letterData.date = new Date().toISOString();
    }
    return this.retractionLetterService.generateLetter(userId, letterData);
  }
} 