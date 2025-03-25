import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PreviewService {
  private readonly previewsDir = path.join(__dirname, '../../assets/previews');

  constructor() {
    // Ensure previews directory exists
    if (!fs.existsSync(this.previewsDir)) {
      fs.mkdirSync(this.previewsDir, { recursive: true });
    }
  }

  async generatePreview(templateId: string, type: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 1200 });

      // Load the template from preview-templates directory
      const templatePath = path.join(__dirname, `../../templates/preview-templates/${type}/${templateId}.html`);
      const templateContent = fs.readFileSync(templatePath, 'utf-8');

      await page.setContent(templateContent);

      // Generate preview
      const previewPath = path.join(this.previewsDir, `${type}-${templateId}.png`);
      await page.screenshot({
        path: previewPath,
        fullPage: true,
      });

      return previewPath;
    } finally {
      await browser.close();
    }
  }

  async getPlaceholder(type: string): Promise<Buffer> {
    const placeholderPath = path.join(this.previewsDir, `${type}-placeholder.png`);
    
    if (fs.existsSync(placeholderPath)) {
      return fs.promises.readFile(placeholderPath);
    }

    // Si le placeholder n'existe pas, générer un placeholder par défaut
    return this.generateDefaultPlaceholder(type);
  }

  private async generateDefaultPlaceholder(type: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 400, height: 600 });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background-color: #f5f5f5;
                font-family: Arial, sans-serif;
              }
              .icon {
                font-size: 48px;
                margin-bottom: 16px;
                color: #666;
              }
              .text {
                font-size: 16px;
                color: #666;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="icon">📄</div>
            <div class="text">${this.getPlaceholderText(type)}</div>
          </body>
        </html>
      `;

      await page.setContent(htmlContent);
      const screenshot = await page.screenshot({ type: 'png' });
      return screenshot as Buffer;
    } finally {
      await browser.close();
    }
  }

  private getPlaceholderText(type: string): string {
    switch (type) {
      case 'receipt':
        return 'Quittance de loyer';
      case 'retraction':
        return 'Lettre de rétraction';
      default:
        return 'Document';
    }
  }
} 