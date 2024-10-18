import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PDFStorageService {
  private async generateStyledPDFDirectlyToBucket(
    receiptData: any,
    fileUpload: any,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
      });

      // Pipe directement vers Firebase Storage
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: 'application/pdf',
        },
      });

      doc.pipe(stream);

      // Titre principal
      doc
        .fontSize(20)
        .text('QUITTANCE DE LOYER', { align: 'center', underline: true });
      doc.moveDown(1.5);

      // Informations de l'agence
      doc.fontSize(12).text('LAFORET', { align: 'left', bold: true });
      doc.text('456 Avenue de Lyon, 69000 Lyon', { align: 'left' });
      doc.text('Téléphone : 06 98 76 54 32', { align: 'left' });
      doc.text('Email : premiumgestion@laforet.com', { align: 'left' });
      doc.moveDown(1.5);

      // Informations du locataire
      doc
        .fontSize(12)
        .text(`Locataire : ${receiptData.tenantName}`, { align: 'left' });
      doc.text(`Adresse : ${receiptData.address}`, { align: 'left' });
      doc.text(`Téléphone : ${receiptData.phone}`, { align: 'left' });
      doc.moveDown(1.5);

      // Date de la période de location
      doc.text(`Période de location : ${receiptData.period}`, {
        align: 'left',
      });
      doc.moveDown(1.5);

      // Tableau récapitulatif des montants à payer
      doc.fontSize(14).text('Détails du paiement :', { underline: true });
      doc.moveDown(0.5);

      // Ajouter un tableau avec des lignes claires pour un format professionnel
      const tableTop = doc.y;
      const tableColumnWidth = 150;
      const tableMargin = 20;

      doc.fontSize(12);

      doc.text('Description', 40, tableTop, { bold: true });
      doc.text('Montant (€)', 40 + tableColumnWidth + tableMargin, tableTop, {
        bold: true,
      });

      // Ligne de séparation
      doc
        .moveTo(40, tableTop + 20)
        .lineTo(540, tableTop + 20)
        .stroke();

      // Remplissage du tableau avec les montants
      const items = [
        { description: 'Loyer', amount: receiptData.rent },
        { description: 'Rappel de loyer', amount: receiptData.backRent },
        { description: 'Provisions/Charges', amount: receiptData.charges },
        { description: 'Frais Administratifs', amount: receiptData.adminFees },
      ];

      let tableRowY = tableTop + 30;
      items.forEach((item) => {
        doc.text(item.description, 40, tableRowY);
        doc.text(
          item.amount.toFixed(2),
          40 + tableColumnWidth + tableMargin,
          tableRowY,
        );
        tableRowY += 20;
      });

      // Ligne de séparation avant le total
      doc
        .moveTo(40, tableRowY + 10)
        .lineTo(540, tableRowY + 10)
        .stroke();

      // Total à payer
      doc.fontSize(12).text('Total à payer', 40, tableRowY + 20);
      doc.text(
        receiptData.total.toFixed(2),
        40 + tableColumnWidth + tableMargin,
        tableRowY + 20,
      );

      doc.moveDown(2);

      // Footer avec signature et date
      doc
        .fontSize(12)
        .text(`Total payé : ${receiptData.total.toFixed(2)} €`, {
          align: 'left',
        });
      doc.text(
        "Cette quittance ne libère l'occupant que pour la période indiquée.",
        { align: 'left' },
      );
      doc.text("Elle n'est pas libératoire des loyers antérieurs impayés.", {
        align: 'left',
      });
      doc.moveDown(1.5);
      doc.text('Fait à : Noisy Le Grand', { align: 'left' });
      doc.text(`Le : ${new Date().toLocaleDateString()}`, { align: 'left' });
      doc.moveDown(3);
      doc.text('Signature du propriétaire :', { align: 'left' });
      doc.moveDown(2);
      doc.text('_________________________', { align: 'left' });

      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', (error) => reject(error));
    });
  }

  private async storePDFInBucket(userId: string): Promise<any> {
    const bucket = admin.storage().bucket();
    const fileName = `quittance-${uuidv4()}.pdf`;
    return bucket.file(`quittances/${userId}/${fileName}`);
  }

  private async generateSignedUrl(fileUpload: any): Promise<string> {
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
    });
    return url;
  }

  async generateAndStorePDF(userId: string, receiptData: any): Promise<string> {
    const fileUpload = await this.storePDFInBucket(userId);
    await this.generateStyledPDFDirectlyToBucket(receiptData, fileUpload);
    const signedUrl = await this.generateSignedUrl(fileUpload);

    await this.storeFileMetadata(userId, {
      fileName: fileUpload.name,
      fileUrl: signedUrl,
      createdAt: new Date(),
    });

    return signedUrl;
  }

  private async storeFileMetadata(userId: string, fileData: any) {
    const firestore = admin.firestore();
    await firestore.collection('files').add({
      userId,
      ...fileData,
    });
  }
}
