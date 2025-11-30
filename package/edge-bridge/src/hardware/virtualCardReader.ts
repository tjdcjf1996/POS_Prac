import { ICardReader } from './interfaces.js';

export class VirtualCardReader implements ICardReader {
  async connect(): Promise<void> {
    console.log('Virtual Card Reader connected.');
  }

  async readCard() {
    console.log('Reading card from Virtual Card Reader...');
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
    console.log('Card read successfully.');
    return 'VIRTUAL-CARD-1234';
  }

  cancel(): void {
    console.log('Card reading cancelled.');
  }
}
