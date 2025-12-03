import { VirtualPrinter } from '../../hardware/virtualPrinter';
import { IHandler } from './IHandler';
import { SdkServer } from '../SdkServer';
import { OrderCommand } from '@posprac/shared';

export class OrderHandler implements IHandler {
  constructor(private printer: VirtualPrinter, private sdkServer: SdkServer) {}
  async execute(command: any): Promise<void> {
    // 인자 커맨드 오더 타입 지정
    const cmd = command as OrderCommand;

    const { menu, price } = cmd.payload;

    // 오더 처리 로직 구현 (임시로 콘솔 로그 출력)
    console.log(`Starting Order processing : ${cmd.id}`);

    const printText = `Order Received:\n Menu: ${menu}\n Price: ${price} Won\n`;

    // 성공 응답 브로드캐스트
    this.sdkServer.broadcast(
      {
        type: 'ORDER_INCOMING',
        success: true,
        payload: cmd.payload,
      },
      'MAIN',
    );

    // 프린트 출력
    await this.printer.print(printText);

    console.log(`Order processed and printed: ${cmd.id}`);
  }
}
