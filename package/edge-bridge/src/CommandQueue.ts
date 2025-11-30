import { PosCommand } from '@posprac/shared';

export class CommandQueue {
  // 커맨드 담을 큐 생성 및 처리 현황 플래그
  private queue: PosCommand[] = [];
  private isProcessing: boolean = false;

  // 큐 추가 메서드
  enqueue(command: PosCommand) {
    this.queue.push(command);

    // 결제가 제일 우선, 큐 정렬
    this.queue.sort((a, b) => this.getPriority(a) - this.getPriority(b));
  }

  // 큐 불러오기
  dequeue(): PosCommand | undefined {
    return this.queue.shift();
  }

  // 큐 비어있는지 확인
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  private getPriority(cmd: PosCommand): number {
    switch (cmd.type) {
      case 'PAYMENT_REQUEST':
        return 1;
      case 'PRINT_RECEIPT':
        return 2;
      case 'ORDER_INCOMING':
        return 2;
      default:
        return 9;
    }
  }
}
