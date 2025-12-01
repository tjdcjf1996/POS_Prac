import { PrintViewer } from 'package/edge-bridge/src/core/PrintViewer.js';
import { IPrinter } from './interfaces';

export class VirtualPrinter implements IPrinter {
  constructor(private viewer?: PrintViewer) {}

  async connect(): Promise<void> {
    console.log('Virtual Printer connected.');
  }

  async print(text: string): Promise<void> {
    console.log('Printing to Virtual Printer...');

    // 시간 지연
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 뷰어가 있으면 출력
    if (this.viewer && this.viewer.isOpen()) {
      this.viewer.printToScreen(text);
    } else {
      // 뷰어가 없으면 콘솔
      console.log(text);
    }
  }
}
