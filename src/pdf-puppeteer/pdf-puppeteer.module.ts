import { Module } from '@nestjs/common';
import { RetractionLetterService } from './services/retraction-letter.service';
import { NoticeLetterService } from './services/notice-letter.service';
import { FileService } from './services/file.service';
import { TemplateService } from './services/template.service';
import { ValidationService } from './services/validation.service';
import { BaseLetterService } from './services/base-letter.service';
import { LetterController } from './controllers/letter.controller';

@Module({
  controllers: [LetterController],
  providers: [
    RetractionLetterService,
    NoticeLetterService,
    FileService,
    TemplateService,
    ValidationService,
  ],
  exports: [RetractionLetterService, NoticeLetterService],
})
export class PdfPuppeteerModule {} 