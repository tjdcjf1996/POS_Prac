import EventEmitter from 'events';
import { SocketClient } from './core/SocketClient';
import type { ClientConfig } from './interfaces/ClientConfig';
import { Payment } from './modules/Payment';
import { Printer } from './modules/Printer';
import type { OrderPayload, PaymentPayload } from '@posprac/shared';

export declare interface PosPrac {
  on(event: 'ORDER_INCOMING', listener: (order: OrderPayload) => void): this;
  on(event: 'PAYMENT_REQUEST', listener: (order: PaymentPayload) => void): this;
  on(event: 'connected', listener: () => void): this;
}

export class PosPrac extends EventEmitter {
  private client: SocketClient;
  public readonly payment: Payment;
  public readonly printer: Printer;

  constructor(config: Partial<ClientConfig> = {}) {
    super();

    // 기본정보 제공으로 입력하지 않으면 명시된 config 사용
    const finalConfig: ClientConfig = {
      url: 'ws://localhost:8080',
      type: 'MAIN',
      id: 'POS_01',
      ...config,
    };

    // 소켓연결 및 모델 설정
    this.client = new SocketClient(finalConfig);
    this.payment = new Payment(this.client);
    this.printer = new Printer(this.client);

    // 이벤트 정의
    this.client.on('ORDER_INCOMING', (data) => this.emit('ORDER_INCOMING', data));
    this.client.on('PAYMENT_REQUEST', (data) => this.emit('PAYMENT_REQUEST', data));
    this.client.on('connected', () => this.emit('connected'));
  }

  async connect() {
    await this.client.connect();
  }
}
