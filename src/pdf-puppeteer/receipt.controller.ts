import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReceiptService, ReceiptData } from './receipt.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @UseGuards(AuthGuard('firebase'))
  @Post('generate/:userId')
  async generateReceipt(@Param('userId') userId: string, @Body() receiptData: ReceiptData) {
    const signedUrl = await this.receiptService.generateReceipt(receiptData, userId);
    return { signedUrl };
  }
} 