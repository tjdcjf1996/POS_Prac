import { SocketClient } from '../core/SocketClient';
import type { PaymentPayload, PaymentResult } from '@posprac/shared';

export class Payment {
  private client: SocketClient;

  constructor(client: SocketClient) {
    this.client = client;
  }

  async request(dto: PaymentPayload): Promise<PaymentResult> {
    return this.client.sendRequest('PAYMENT_REQUEST', dto);
  }
}
