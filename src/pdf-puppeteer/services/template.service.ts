import { Injectable } from '@nestjs/common';
import { FormattedRetractionLetterData } from '../interfaces/retraction-letter.interface';
import { FormattedNoticeLetterData } from '../interfaces/notice-letter.interface';

@Injectable()
export class TemplateService {
  generateRetractionLetterHTML(letterData: FormattedRetractionLetterData): string {
    const soussigne = letterData.gender === 'F' ? 'soussignée' : 'soussigné';
    
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
            .sender-info {
              margin-bottom: 20px;
            }
            .recipient-info {
              margin-bottom: 20px;
            }
            .date-location {
              margin-bottom: 20px;
              text-align: right;
            }
            .subject {
              margin-bottom: 20px;
              font-weight: bold;
            }
            .letter-content {
              margin-bottom: 30px;
            }
            .signature {
              margin-top: 100px;
            }
            .signature-line {
              margin-top: 50px;
              border-top: 1px solid #000;
              width: 200px;
            }
            .contact-info {
              font-size: 0.9em;
              color: #666;
              margin-top: 5px;
            }
            .contract-details {
              margin: 20px 0;
              padding: 10px;
              background-color: #f9f9f9;
              border-left: 3px solid #333;
            }
          </style>
        </head>
        <body>
          <div class="sender-info">
            ${letterData.senderName}<br>
            ${letterData.senderAddress}<br>
            ${letterData.senderPostalCode}, ${letterData.senderCity}
            ${letterData.senderPhone !== 'Non spécifié' ? `<div class="contact-info">Tél : ${letterData.senderPhone}</div>` : ''}
            ${letterData.senderEmail !== 'Non spécifié' ? `<div class="contact-info">Email : ${letterData.senderEmail}</div>` : ''}
          </div>

          <div class="recipient-info">
            À l'attention de :<br>
            ${letterData.recipientName}<br>
            ${letterData.recipientAddress}
            ${letterData.recipientPhone !== 'Non spécifié' ? `<div class="contact-info">Tél : ${letterData.recipientPhone}</div>` : ''}
            ${letterData.recipientEmail !== 'Non spécifié' ? `<div class="contact-info">Email : ${letterData.recipientEmail}</div>` : ''}
          </div>

          <div class="date-location">
            Fait à ${letterData.location}, le ${letterData.date}
          </div>

          <div class="subject">
            Objet : Rétractation d'un crédit à la consommation<br>
            Lettre recommandée avec accusé de réception
          </div>

          <div class="contract-details">
            <strong>Référence du contrat :</strong> ${letterData.contractReference}<br>
            <strong>Type de crédit :</strong> ${letterData.loanType}<br>
            <strong>Durée du crédit :</strong> ${letterData.loanDuration}
          </div>

          <div class="letter-content">
            Madame, Monsieur,<br><br>

            Je ${soussigne} ${letterData.senderName}, vous informe, par la présente, de ma décision de me rétracter de l'offre de crédit à la consommation d'un montant de ${letterData.amount} euros, que j'ai acceptée en date du ${letterData.contractDate}.<br><br>

            Conformément à l'article L. 312-19 du Code de la consommation, cette rétractation intervient dans le délai légal de 14 jours calendaires suivant l'acceptation de l'offre.<br><br>

            Je vous remercie de bien vouloir prendre en compte cette rétractation et de m'en accuser réception.<br><br>

            Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.
          </div>

          <div class="signature">
            <div class="signature-line"></div>
            ${letterData.senderName}
          </div>
        </body>
      </html>
    `;
  }

  generateNoticeLetterHTML(letterData: FormattedNoticeLetterData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
            }
            .sender-info {
              margin-bottom: 20px;
            }
            .recipient-info {
              margin-bottom: 20px;
            }
            .date-location {
              margin-bottom: 20px;
              text-align: right;
            }
            .subject {
              margin-bottom: 20px;
              font-weight: bold;
            }
            .letter-content {
              margin-bottom: 20px;
            }
            .signature {
              margin-top: 50px;
            }
            .signature-name {
              margin-top: 20px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="sender-info">
            ${letterData.senderName}<br>
            ${letterData.senderAddress}<br>
            ${letterData.senderPostalCode} ${letterData.senderCity}
          </div>

          <div class="recipient-info">
            ${letterData.recipientName}<br>
            ${letterData.recipientAddress}
          </div>

          <div class="date-location">
            ${letterData.location}, le ${letterData.date}
          </div>

          <div class="subject">
            Objet : notification de congé de logement
          </div>

          <div class="letter-content">
            ${letterData.deliveryType}<br><br>

            Madame, Monsieur,<br><br>

            Je vais prochainement quitter mon logement.${letterData.isTightZone ? ' Celui-ci se trouve en zone tendue.' : ''}<br><br>

            ${letterData.isTightZone ? 'Conformément à la loi n° 89-462 du 6 juillet 1989 (article 15) et au décret n° 2013-392 relatif au champ d\'application de la taxe annuelle sur les logements vacants instituée par l\'article 232 du code général des impôts (premier tableau en annexe du décret), le préavis dans cette situation est d\'un mois.<br><br>' : ''}

            Le congé prendra effet 1 mois après la date de remise du courrier.<br><br>

            Afin de convenir ensemble d'une date pour vous remettre les clés du logement et réaliser ensemble l'état des lieux, je vous informe que le déménagement est prévu le ${letterData.movingDate}.<br><br>

            Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.
          </div>

          <div class="signature">
            <div class="signature-name">${letterData.senderName}</div>
          </div>
        </body>
      </html>
    `;
  }
} 