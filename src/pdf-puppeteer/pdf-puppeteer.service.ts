import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PDFPuppeteerService {
  async generatePDF(userId: string, receiptData: any): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });

      // Générer le HTML avec les données
      const htmlContent = this.generateHTML(receiptData);
      await page.setContent(htmlContent);

      // Générer le PDF
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

      // Sauvegarder dans Firebase Storage
      const fileName = `quittance-${uuidv4()}.pdf`;
      const bucket = admin.storage().bucket();
      const file = bucket.file(`quittances/${userId}/${fileName}`);

      await file.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf',
        },
      });

      // Générer l'URL signée
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 1 heure
      });

      // Sauvegarder les métadonnées dans Firestore
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

  private generateHTML(receiptData: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .company-info {
              margin-bottom: 20px;
            }
            .tenant-info {
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 10px;
              border: 1px solid #ddd;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
            }
            .footer {
              margin-top: 50px;
              text-align: left;
            }
            .signature {
              margin-top: 100px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>QUITTANCE DE LOYER</h1>
          </div>

          <div class="company-info">
            <h2>LAFORET</h2>
            <p>456 Avenue de Lyon, 69000 Lyon</p>
            <p>Téléphone : 06 98 76 54 32</p>
            <p>Email : premiumgestion@laforet.com</p>
          </div>

          <div class="tenant-info">
            <h2>Informations du locataire</h2>
            <p>Locataire : ${receiptData.tenantName}</p>
            <p>Adresse : ${receiptData.address}</p>
            <p>Téléphone : ${receiptData.phone}</p>
          </div>

          <div>
            <h2>Période de location</h2>
            <p>${receiptData.period}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Montant (€)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Loyer</td>
                <td>${receiptData.rent.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Rappel de loyer</td>
                <td>${receiptData.backRent.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Provisions/Charges</td>
                <td>${receiptData.charges.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Frais Administratifs</td>
                <td>${receiptData.adminFees.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p><strong>Total à payer : ${receiptData.total.toFixed(2)} €</strong></p>
            <p>Cette quittance ne libère l'occupant que pour la période indiquée.</p>
            <p>Elle n'est pas libératoire des loyers antérieurs impayés.</p>
          </div>

          <div class="signature">
            <p>Fait à : Noisy Le Grand</p>
            <p>Le : ${new Date().toLocaleDateString()}</p>
            <p>Signature du propriétaire :</p>
            <div style="margin-top: 50px; border-top: 1px solid #000; width: 200px;"></div>
          </div>
        </body>
      </html>
    `;
  }

  private async saveFileMetadata(userId: string, fileData: any) {
    const firestore = admin.firestore();
    await firestore.collection('files').add({
      userId,
      ...fileData,
    });
  }
} 