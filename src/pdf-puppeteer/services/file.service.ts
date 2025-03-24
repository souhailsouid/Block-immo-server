import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { FileMetadata, LetterType } from '../interfaces/letter.interface';

@Injectable()
export class FileService {
  async savePdfToStorage(userId: string, pdfBuffer: Buffer, type: LetterType): Promise<string> {
    const fileName = `${type}-${uuidv4()}.pdf`;
    const bucket = admin.storage().bucket();
    const file = bucket.file(`${type}/${userId}/${fileName}`);

    await file.save(pdfBuffer, {
      metadata: {
        contentType: 'application/pdf',
      },
    });

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
    });

    await this.saveFileMetadata(userId, {
      fileName,
      fileUrl: signedUrl,
      createdAt: new Date(),
      type,
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