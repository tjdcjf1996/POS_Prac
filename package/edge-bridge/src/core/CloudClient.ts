import { WebSocket } from 'ws';
import { CommandQueue } from '../CommandQueue';

export class CloudClient {
  private cloudSocket: WebSocket | null = null;

  constructor(private url: string, private queue: CommandQueue) {}

  // 소켓 연결 메서드
  connect() {
    console.log('Connecting to Cloud Server...');
    this.cloudSocket = new WebSocket(this.url, {
      headers: {
        'X-API-KEY': process.env.API_KEY || '',
      },
    });

    // 연결 성공시
    this.cloudSocket.on('open', () => console.log('Connected to Cloud Server.'));

    // 메시지 수신시
    this.cloudSocket.on('message', (data) => {
      try {
        const command = JSON.parse(data.toString());
        console.log('Received command from Cloud Server:', command);
        this.queue.enqueue(command);
      } catch (err) {
        console.error('Error parsing command from Cloud Server:', err);
      }
    });

    // 연결 종료시 재연결 시도
    this.cloudSocket.on('close', () => {
      console.log('Reconnecting in 3 seconds...');
      setTimeout(() => this.connect(), 3000);
    });

    // 에러 발생시
    this.cloudSocket.on('error', (error) => {
      console.error('Cloud socket error:', error);
      this.cloudSocket?.close();
    });
  }
}
