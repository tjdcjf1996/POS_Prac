import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import { WebhookBody } from './interfaces/webhook';
import { OrderCommand } from '@posprac/shared';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// 기본 미들웨어 설정
app.use(cors());
app.use(express.json());

// 서버포트
const PORT = process.env.PORT || 4000;

// 연결된 스토어 관리 맵
const connectedStores = new Map<string, WebSocket>();

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  // API 키 검증
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    console.log('Connection rejected: Invalid API Key');
    ws.close(1008, 'Invalid API Key');
    return;
  }

  const urlParams = new URLSearchParams(req.url?.split('?')[1]);
  const storeId = urlParams.get('storeId');

  // 스토어 아이디 없으면 1008 클로즈
  if (!urlParams || !storeId) {
    console.log('Connection rejected: Missing storeId');
    ws.close(1008, 'Missing storeId');
    return;
  }

  // 스토어 연결정보 등록
  connectedStores.set(storeId, ws);
  console.log(`Store connected: ${storeId}`);

  // 연결 종료 시 맵에서 제거
  ws.on('close', () => {
    connectedStores.delete(storeId);
    console.log(`Store disconnected: ${storeId}`);
  });
});

// 주문 수신 API
app.post('/api/orders', (req: Request<{}, {}, WebhookBody>, res: Response) => {
  const { storeId, menu, price } = req.body;
  if (!storeId || !menu || !price) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  // 해당 스토어에 연결된 웹소켓이 있는지 확인
  const storeSocket = connectedStores.get(storeId);
  if (!storeSocket || storeSocket.readyState !== WebSocket.OPEN) {
    console.log(`${storeId} - Store is not connected`);
    return res.status(404).json({ message: 'Store is not connected' });
  }

  // 명령 생성
  const command: OrderCommand = {
    type: 'ORDER_INCOMING',
    id: `order-${Date.now()}`,
    timestamp: Date.now(),
    payload: {
      menu,
      price,
    },
  };

  // 매장으로 훅 전송
  storeSocket.send(JSON.stringify(command));
  console.log(`${storeId} - Order sent: ${menu}`);

  return res.status(200).json({ message: 'Order sent to store' });
});

// 서버 시작
server.listen(PORT, () => {
  console.log(`Delivery server is running on port ${PORT}`);
});
