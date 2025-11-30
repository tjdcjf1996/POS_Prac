import { IHandler } from './IHandler';
import { PosCommand, PrintCommand } from '@posprac/shared';
import { VirtualPrinter } from '../../hardware/virtualPrinter';
import { SdkServer } from '../SdkServer';

export class PrintHandler implements IHandler {
  constructor(private printer: VirtualPrinter, private sdkServer: SdkServer) {}

  async execute(command: PosCommand): Promise<void> {
    // 인자 커맨드 프린트 타입 지정
    const cmd = command as PrintCommand;
    // 프린트 처리 로직 구현 (임시로 콘솔 로그 출력)
    await this.printer.print(cmd.payload.text);

    // 성공 응답 브로드캐스트
    this.sdkServer.broadcast({
      requestId: cmd.id,
      success: true,
    });
  }
}
