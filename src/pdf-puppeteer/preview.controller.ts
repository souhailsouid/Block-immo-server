import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PreviewService } from './preview.service';

@Controller('preview')
export class PreviewController {
  constructor(private readonly previewService: PreviewService) {}

  @Get(':type/:template')
  async getPreview(
    @Param('type') type: string,
    @Param('template') template: string,
    @Res() res: Response,
  ) {
    try {
      const previewPath = await this.previewService.generatePreview(template, type);
      res.sendFile(previewPath);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate preview' });
    }
  }

  @Get('placeholder/:type')
  async getPlaceholder(
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    const buffer = await this.previewService.getPlaceholder(type);
    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    });
    res.send(buffer);
  }
} 