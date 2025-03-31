import { Module } from '@nestjs/common';
import { RetractionLetterController } from './retraction-letter.controller';
import { RetractionLetterService } from './retraction-letter.service';
import { FileService } from './services/file.service';
import { TemplateService } from './services/template.service';
import { ValidationService } from './services/validation.service';

@Module({
  controllers: [RetractionLetterController],
  providers: [
    RetractionLetterService,
    FileService,
    TemplateService,
    ValidationService
  ],
  exports: [RetractionLetterService]
})
export class RetractionLetterModule {} 