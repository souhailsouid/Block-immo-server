import { Controller, Post, UploadedFile, UseInterceptors, Req, Get, Param, Logger, UseGuards } from '@nestjs/common';
import { MulterFile } from 'multer'; 
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './storage.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('storage')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MulterFile, @Req() req: Request) {
    const userId = req['user'].uid;
    const fileData = await this.fileService.uploadFile(file, userId);
    return { message: 'Fichier uploadé avec succès', fileData };
  }

  @Get('user-files')
  async getUserFiles(@Req() req: Request) {
    const userId = req['user'].uid;
    const files = await this.fileService.getFilesWithSignedUrls(userId);
    return { files };
  }

  @Get('file/:filename')
  async getFileUrl(@Param('filename') filename: string) {
    const url = await this.fileService.generateSignedUrl(filename);
    return { url };
  }

  @UseGuards(AuthGuard('firebase'))
  @Get('documents/:userId/:fileName')
  async getSignedDocument(
    @Param('userId') userId: string,
    @Param('fileName') fileName: string
  ) {
    const signedUrl = await this.fileService.getSignedDocument(userId, fileName);
    return { url: signedUrl };
  }
}
