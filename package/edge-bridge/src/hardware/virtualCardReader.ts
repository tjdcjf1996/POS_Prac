import { PaymentResult } from '@posprac/shared';
import { ICardReader } from './interfaces.js';

export class VirtualCardReader implements ICardReader {
  private num = 0;
  async connect(): Promise<void> {
    console.log('Virtual Card Reader connected.');
  }

  async readCard(): Promise<PaymentResult> {
    console.log('Reading card from Virtual Card Reader...');
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
    console.log('Card read successfully.');
    const approvalNo = `approval-${this.num}`;
    const cardNum = 'VIRTUAL-CARD-1234';
    this.num++;

    return { approvalNo, cardNum };
  }

  cancel(): void {
    console.log('Card reading cancelled.');
  }
}
