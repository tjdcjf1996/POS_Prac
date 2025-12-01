import { WebSocket, WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';
import path from 'path';
import open from 'open';

export class PrintViewer {
  private wss: WebSocketServer;
  private clients = new Set<WebSocket>();

  constructor(port: number = 9090) {
    const app = express();
    const server = http.createServer(app);
    this.wss = new WebSocketServer({ server });

    // 정적 파일 제공
    const publicPath = path.join(__dirname, '../public');
    app.use(express.static(publicPath));

    // 웹소켓 연결 처리
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New Print Viewer client connected');
      this.clients.add(ws);
      ws.on('close', () => {
        console.log('Print Viewer client disconnected');
        this.clients.delete(ws);
      });
    });

    // 서버 시작
    server.listen(port, async () => {
      console.log(`Print Viewer listening on http://localhost:${port}`);
      // 기본 브라우저로 열기
      await open(`http://localhost:${port}/printer.html`);
    });
  }

  printToScreen(text: string) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ text }));
      }
    });
  }

  isOpen(): boolean {
    return this.clients.size > 0;
  }
}
