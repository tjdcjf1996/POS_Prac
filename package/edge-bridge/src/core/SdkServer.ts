import { PosCommand, PosResponse } from '@posprac/shared';
import { CommandQueue } from '../CommandQueue';
import { WebSocket, WebSocketServer } from 'ws';

export class SdkServer {
  // wss 및 클라이언트
  private wss: WebSocketServer;
  private clients = new Set<WebSocket>();

  constructor(port: number, private queue: CommandQueue) {
    this.wss = new WebSocketServer({ port });
    console.log(`SDK Server listening on port ${port}`);

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New SDK client connected');
      // 연결된 클라이언트 저장
      this.clients.add(ws);

      // 메세지 수신
      ws.on('message', (data) => {
        try {
          const command = JSON.parse(data.toString()) as PosCommand;
          console.log('Received command from SDK client:', command);
          this.queue.enqueue(command);
        } catch (err) {
          console.error('Error parsing command from SDK client:', err);
        }
      });

      // 소켓 종료
      ws.on('close', () => {
        console.log('SDK client disconnected');
        this.clients.delete(ws);
      });

      // 소켓 에러
      ws.on('error', (error) => {
        console.error('SDK client socket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  // 모든 클라이언트에 메세지 전송
  broadcast(message: PosResponse) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}
