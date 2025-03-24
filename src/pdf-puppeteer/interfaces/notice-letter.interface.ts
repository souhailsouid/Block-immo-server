import { BaseLetterData } from './letter.interface';

export interface NoticeLetterData extends BaseLetterData {
  deliveryType: string;  // Type de remise du courrier
  movingDate: string;    // Date du déménagement
  isTightZone: boolean;  // Zone tendue ou non
}

export interface FormattedNoticeLetterData extends NoticeLetterData {
  date: string;
  movingDate: string;
} 