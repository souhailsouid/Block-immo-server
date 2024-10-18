import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { MulterFile } from 'multer';

@Injectable()
export class FileService {
  async uploadFile(file: MulterFile, userId: string) {
    const bucket = admin.storage().bucket();
    const uniqueFilename = `${userId}-${uuidv4()}-${file.originalname}`;
    const fileUpload = bucket.file(uniqueFilename);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          owner: userId,
        },
      },
    });

    const fileRecord = {
      userId,
      fileName: uniqueFilename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      createdAt: new Date().toISOString(),
    };

    await admin.firestore().collection('files').add(fileRecord);

    return { filename: uniqueFilename };
  }

  async getUserFiles(userId: string) {
    const filesSnapshot = await admin
      .firestore()
      .collection('files')
      .where('userId', '==', userId)
      .get();
    return filesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async generateSignedUrl(fileName: string, userId: string) {
    const file = admin.storage().bucket().file(fileName);

    const [metadata] = await file.getMetadata();
    if (metadata.metadata.owner !== userId) {
      throw new Error('Unauthorized access to this file');
    }

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
    });

    return url;
  }
}
