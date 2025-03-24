export interface BaseLetterData {
  senderName: string;
  senderAddress: string;
  senderPostalCode: string;
  senderCity: string;
  senderPhone?: string;
  senderEmail?: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone?: string;
  recipientEmail?: string;
  location: string;
  date: string;
  gender: 'M' | 'F';
}

export interface FileMetadata {
  fileName: string;
  fileUrl: string;
  createdAt: Date;
  type: LetterType;
}

export enum LetterType {
  RETRACTION = 'retraction',
  INVOICE = 'invoice',
  QUOTE = 'quote',
  CERTIFICATE = 'certificate',
  NOTICE = 'notice'
} 