import EventEmitter from 'events';
import { PosError } from './PosError';
import type { ClientConfig } from '../interfaces/ClientConfig';
import type { CommandResponseMap, PosCommand, PosResponse } from '@posprac/shared';
import WebSocket from 'isomorphic-ws';
import { v4 as uuidv4 } from 'uuid';

export class SocketClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private pendingRequests = new Map<string, { resolve: Function; reject: Function }>();
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    super();
    this.config = config;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // url 구성
      const url = `${this.config.url}?type=${this.config.type}${
        this.config.id ? `&id=${this.config.id}` : ''
      }`;

      this.ws = new WebSocket(url);

      // 연결 성공시
      this.ws.onopen = () => {
        this.emit('connected');
        resolve();
      };

      // 메시지 수신시
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data.toString()) as PosResponse;

          // 내가 보낸 요청에 대한 응답
          if (message.requestId && this.pendingRequests.has(message.requestId)) {
            const { resolve, reject } = this.pendingRequests.get(message.requestId)!;

            // 메세지 성공여부
            if (message.success) {
              resolve(message.data);
            } else {
              reject(
                new PosError(
                  message.errorCode || 'UNKNOWN_ERROR',
                  message.errorMessage || 'Unknown Error',
                ),
              );
            }

            // 펜딩 맵에서 제거
            this.pendingRequests.delete(message.requestId);
          } else if (message.type) {
            this.emit(message.type, message.payload);
          }
        } catch (error) {
          console.error('SDK parse Error:', error);
        }
      };

      // 에러 발생시
      this.ws.onerror = (error) => reject(error);
    });
  }

  // 요청 전송 메서드
  async sendRequest<T extends keyof CommandResponseMap>(
    type: T,
    payload: Extract<PosCommand, { type: T }>['payload'],
  ): Promise<CommandResponseMap[T]> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
      throw new Error('WebSocket is not connected');

    const id = uuidv4();
    const command = {
      type,
      id,
      timestamp: Date.now(),
      payload,
    } as PosCommand;

    this.ws.send(JSON.stringify(command));

    return new Promise((resolve, reject) => {
      // 타임아웃 설정
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new PosError('TIMEOUT', 'Request timed out'));
      }, 5000);

      // 펜딩 맵에 추가
      this.pendingRequests.set(id, {
        resolve: (data: any) => {
          clearTimeout(timeout);
          resolve(data);
        },
        reject: (error: any) => {
          clearTimeout(timeout);
          reject(error);
        },
      });
    });
  }
}
