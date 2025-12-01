import { IHandler } from '../handlers/IHandler';
import { PaymentCommand, PosCommand } from '@posprac/shared';
import { VirtualCardReader } from '../../hardware/virtualCardReader';
import { SdkServer } from '../SdkServer';

export class PaymentHandler implements IHandler {
  constructor(private reader: VirtualCardReader, private sdkServer: SdkServer) {}

  async execute(command: PosCommand): Promise<void> {
    // 인자 커맨드 페이먼트 타입 지정
    const cmd = command as PaymentCommand;

    console.log(`Starting Payment processing : ${cmd.id}`);
    // 결제 처리 로직 구현 (임시로 콘솔 로그 출력)
    const cardData = await this.reader.readCard();

    this.sdkServer.broadcast({
      requestId: cmd.id,
      success: true,
      data: { ...cardData },
    });
  }
}
