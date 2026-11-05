import { describe, it, expect } from 'vitest';
import { dataService } from '../lib/dataService';

describe('Fees & Payment Gateway (Razorpay Test Mode)', () => {
  it('retrieves institutional fee structure', async () => {
    const structure = await dataService.getFeeStructure();
    expect(structure).toBeDefined();
    expect(structure.total_amount).toBe(90000);
    expect(structure.tuition_fee).toBe(75000);
  });

  it('records online payment and generates unique official receipt', async () => {
    const payment = await dataService.makeFeePayment(45000, 'b0000000-0000-0000-0000-000000000001');
    expect(payment).toBeDefined();
    expect(payment.amount).toBe(45000);
    expect(payment.receipt_number).toMatch(/^REC-\d{4}-CS-\d+$/);
    expect(payment.status).toBe('completed');
  });
});
