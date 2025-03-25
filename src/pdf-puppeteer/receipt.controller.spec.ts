import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';

describe('ReceiptController', () => {
  let controller: ReceiptController;
  let service: ReceiptService;

  const mockReceiptData = {
    receiptNumber: 'Q-2024-001',
    companyName: 'LAFORET',
    companyAddress: '456 Avenue de Lyon',
    companyCity: '69000 Lyon',
    companyPhone: '04 78 XX XX XX',
    companyEmail: 'contact@laforet.fr',
    city: 'Lyon',
    date: '15 janvier 2024',
    tenantName: 'M. Jean Dupont',
    tenantAddress: '123 Rue de la République',
    tenantCity: '69002 Lyon',
    propertyAddress: '789 Rue de la Paix',
    propertyCity: '69003 Lyon',
    propertyType: 'Appartement',
    propertySurface: '45',
    period: 'Janvier 2024',
    paymentDate: '5 janvier 2024',
    paymentMethod: 'Virement bancaire',
    rentAmount: '800,00',
    chargesAmount: '50,00',
    totalAmount: '850,00'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptController],
      providers: [
        {
          provide: ReceiptService,
          useValue: {
            generateReceipt: jest.fn().mockResolvedValue(Buffer.from('test-pdf')),
          },
        },
      ],
    }).compile();

    controller = module.get<ReceiptController>(ReceiptController);
    service = module.get<ReceiptService>(ReceiptService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateReceipt', () => {
    it('should generate a receipt and return the PDF buffer', async () => {
      const userId = 'test-user-id';
      const result = await controller.generateReceipt(userId, mockReceiptData);

      expect(result).toEqual({ pdfBuffer: Buffer.from('test-pdf') });
      expect(service.generateReceipt).toHaveBeenCalledWith(mockReceiptData);
    });
  });
}); 