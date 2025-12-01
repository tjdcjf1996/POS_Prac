import {
  CLIENT_TYPE,
  type PosClientType,
  type PosCommand,
  type PosResponse,
} from '@posprac/shared';
import { CommandQueue } from '../CommandQueue';
import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

interface ClientInfo {
  ws: WebSocket;
  type: PosClientType;
  id?: string;
}

export class SdkServer {
  // wss 및 클라이언트
  private wss: WebSocketServer;
  private clients = new Map<WebSocket, ClientInfo>();

  constructor(port: number, private queue: CommandQueue) {
    this.wss = new WebSocketServer({ port });
    console.log(`SDK Server listening on port ${port}`);

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const urlParams = new URLSearchParams(req.url?.split('?')[1]);
      const rawType = urlParams.get('type');
      const type = isValidType(rawType) ? rawType : null;
      const id = urlParams.get('id') || 'UNKNOWN';

      if (!type) {
        console.log('Not Found SDK Type');
        ws.close(1008, 'Not Found SDK Type');
        return;
      }

      console.log('New SDK client connected');
      // 연결된 클라이언트 저장
      this.clients.set(ws, { ws, type, id });

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

  // 모든 클라이언트 또는 지정된 타입 클라이언트에 메세지 전송
  broadcast(message: PosResponse, type?: PosClientType) {
    this.clients.forEach((client) => {
      // 타입이 지정된 경우 맞는 타입에게만 브로드캐스팅
      if (type && client.type !== type) return;

      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }
}

// 타입 가드 함수
function isValidType(value: string | null): value is PosClientType {
  // 타입에 맞지 않는 이름이나 null인지 체크
  return (CLIENT_TYPE as readonly string[]).includes(value || '');
}
