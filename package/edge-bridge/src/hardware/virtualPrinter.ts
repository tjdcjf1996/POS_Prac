import { IPrinter } from './interfaces';

export class VirtualPrinter implements IPrinter {
  async connect(): Promise<void> {
    console.log('Virtual Printer connected.');
  }

  async print(text: string): Promise<void> {
    console.log('Printing to Virtual Printer...');
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
    console.log('Virtual Printer Output : ', text);
  }
}
