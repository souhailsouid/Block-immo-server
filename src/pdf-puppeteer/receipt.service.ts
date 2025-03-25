import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export interface ReceiptData {
  receiptNumber: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyPhone: string;
  companyEmail: string;
  city: string;
  date: string;
  tenantName: string;
  tenantAddress: string;
  tenantCity: string;
  propertyAddress: string;
  propertyCity: string;
  propertyType: string;
  propertySurface: string;
  period: string;
  paymentDate: string;
  paymentMethod: string;
  rentAmount: string;
  chargesAmount: string;
  totalAmount: string;
}

@Injectable()
export class ReceiptService {
  private readonly templatesDir = path.join(__dirname, '../../templates/preview-templates');

  async generateReceipt(receiptData: ReceiptData, userId: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 1200 });

      // Load the template
      const templatePath = path.join(this.templatesDir, 'receipt/standard.html');
      const templateContent = fs.readFileSync(templatePath, 'utf-8');

      // Replace placeholders with actual data
      const htmlContent = templateContent
        .replace(/\[Numéro de quittance\]/g, receiptData.receiptNumber)
        .replace(/\[Nom de l'entreprise\]/g, receiptData.companyName)
        .replace(/\[Adresse de l'entreprise\]/g, receiptData.companyAddress)
        .replace(/\[Code postal et ville\]/g, `${receiptData.companyCity}`)
        .replace(/\[Téléphone\]/g, receiptData.companyPhone)
        .replace(/\[Email\]/g, receiptData.companyEmail)
        .replace(/\[Ville\]/g, receiptData.city)
        .replace(/\[Date\]/g, receiptData.date)
        .replace(/\[Nom du locataire\]/g, receiptData.tenantName)
        .replace(/\[Adresse du locataire\]/g, receiptData.tenantAddress)
        .replace(/\[Code postal et ville\]/g, `${receiptData.tenantCity}`)
        .replace(/\[Adresse du bien\]/g, receiptData.propertyAddress)
        .replace(/\[Code postal et ville\]/g, `${receiptData.propertyCity}`)
        .replace(/\[Type de bien\]/g, receiptData.propertyType)
        .replace(/\[Surface\]/g, receiptData.propertySurface)
        .replace(/\[Période\]/g, receiptData.period)
        .replace(/\[Date de paiement\]/g, receiptData.paymentDate)
        .replace(/\[Mode de paiement\]/g, receiptData.paymentMethod)
        .replace(/\[Montant du loyer\]/g, receiptData.rentAmount)
        .replace(/\[Montant des charges\]/g, receiptData.chargesAmount)
        .replace(/\[Montant total\]/g, receiptData.totalAmount);

      await page.setContent(htmlContent);

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      // Save to Firebase Storage
      const fileName = `receipt-${uuidv4()}.pdf`;
      const bucket = admin.storage().bucket();
      const file = bucket.file(`receipts/${userId}/${fileName}`);

      await file.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf',
        },
      });

      // Generate signed URL
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      // Save metadata to Firestore
      await this.saveFileMetadata(userId, {
        fileName,
        fileUrl: signedUrl,
        createdAt: new Date(),
      });

      return signedUrl;
    } finally {
      await browser.close();
    }
  }

  private async saveFileMetadata(userId: string, fileData: any) {
    const firestore = admin.firestore();
    await firestore.collection('files').add({
      userId,
      ...fileData,
    });
  }
} 