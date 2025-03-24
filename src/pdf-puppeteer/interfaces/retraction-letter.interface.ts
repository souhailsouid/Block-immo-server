import { BaseLetterData } from './letter.interface';

export interface RetractionLetterData extends BaseLetterData {
  amount: string;
  contractDate?: string;
  contractReference?: string;
  loanType?: string;
  loanDuration?: string;
}

export interface FileMetadata {
  fileName: string;
  fileUrl: string;
  createdAt: Date;
}

export interface FormattedRetractionLetterData extends RetractionLetterData {
  date: string;
  contractDate: string;
} 