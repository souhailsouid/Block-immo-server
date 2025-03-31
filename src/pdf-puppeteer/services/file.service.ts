import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { FileMetadata, LetterType } from '../interfaces/letter.interface';

@Injectable()
export class FileService {
  async savePdfToStorage(userId: string, pdfBuffer: Buffer, type: LetterType): Promise<{ signedUrl: string; metadata: FileMetadata }> {
    const fileName = `${type}-${uuidv4()}.pdf`;
    const filePath = `${type}/${userId}/${fileName}`;
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);

    await file.save(pdfBuffer, {
      metadata: {
        contentType: 'application/pdf',
      },
    });

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
    });

    const metadata: FileMetadata = {
      fileName,
      filePath,
      createdAt: new Date(),
      type,
    };

    await this.saveFileMetadata(userId, metadata);

    return { signedUrl, metadata };
  }

  async generateSignedUrl(filePath: string): Promise<string> {
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
    });
    return signedUrl;
  }

  private async saveFileMetadata(userId: string, fileData: FileMetadata): Promise<void> {
    const firestore = admin.firestore();
    await firestore.collection('files').add({
      userId,
      ...fileData,
    });
  }
} 