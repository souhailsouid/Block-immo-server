import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RetractionLetterService } from '../services/retraction-letter.service';
import { NoticeLetterService } from '../services/notice-letter.service';
import { RetractionLetterData } from '../interfaces/retraction-letter.interface';
import { NoticeLetterData } from '../interfaces/notice-letter.interface';
import { AuthGuard } from '../guards/auth.guard';

@Controller('letters')
@UseGuards(AuthGuard)
export class LetterController {
  constructor(
    private readonly retractionLetterService: RetractionLetterService,
    private readonly noticeLetterService: NoticeLetterService,
  ) {}

  @Post('retraction/:userId')
  async generateRetractionLetter(
    @Param('userId') userId: string,
    @Body() letterData: RetractionLetterData,
  ): Promise<string> {
    return this.retractionLetterService.generateLetter(userId, letterData);
  }

  @Post('notice/:userId')
  async generateNoticeLetter(
    @Param('userId') userId: string,
    @Body() letterData: NoticeLetterData,
  ): Promise<string> {
    return this.noticeLetterService.generateLetter(userId, letterData);
  }
} 