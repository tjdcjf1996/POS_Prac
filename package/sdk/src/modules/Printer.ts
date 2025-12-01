import { SocketClient } from '../core/SocketClient';
import type { PrintResult } from '@posprac/shared';

export class Printer {
  private client: SocketClient;
  constructor(client: SocketClient) {
    this.client = client;
  }

  async print(text: string): Promise<PrintResult> {
    return this.client.sendRequest('PRINT_RECEIPT', { text });
  }
}
