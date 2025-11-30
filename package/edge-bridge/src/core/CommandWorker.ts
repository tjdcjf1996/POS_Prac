import { IHandler } from './handlers/IHandler';
import { CommandQueue } from '../CommandQueue';
import { SdkServer } from '../core/SdkServer';
import { VirtualCardReader } from '../hardware/virtualCardReader';
import { VirtualPrinter } from '../hardware/virtualPrinter';
import { PaymentHandler } from './handlers/PaymentHandler';
import { PrintHandler } from './handlers/PrintHandler';
import { OrderHandler } from './handlers/OrderHandler';

export class CommandWorker {
  private printer = new VirtualPrinter();
  private reader = new VirtualCardReader();

  // 처리 현황 플래그
  private isProcessing = false;

  // 핸들러 저장 맵
  private handlers = new Map<string, IHandler>();

  constructor(private queue: CommandQueue, private sdkServer: SdkServer) {}

  async init() {
    console.log('Initializing Virtual Hardware...');
    await this.printer.connect();
    await this.reader.connect();

    // 핸들러 등록
    this.handlers.set('PAYMENT_REQUEST', new PaymentHandler(this.reader, this.sdkServer));
    this.handlers.set('PRINT_RECEIPT', new PrintHandler(this.printer, this.sdkServer));
    this.handlers.set('ORDER_INCOMING', new OrderHandler(this.printer, this.sdkServer));

    // 프로그램 루프
    setInterval(() => this.process(), 100);
  }

  private async process() {
    // 프로세싱 또는 큐가 비어있지 않을 때에만 수행
    if (this.isProcessing || this.queue.isEmpty()) return;

    this.isProcessing = true;
    const command = this.queue.dequeue()!;

    try {
      const handler = this.handlers.get(command.type);
      if (!handler) {
        console.warn(`Not found command type: ${command.type}`);
      } else {
        await handler.execute(command);
      }
    } catch (error) {
      console.error('Error processing command:', error);
    }

    this.isProcessing = false;
  }
}
