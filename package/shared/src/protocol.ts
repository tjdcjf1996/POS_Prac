import type { OrderCommand } from './models/order';
import type { PaymentCommand, PaymentResult } from './models/payment';
import type { PrintCommand, PrintResult } from './models/printer';

export type PosCommand = PaymentCommand | PrintCommand | OrderCommand;
export const CLIENT_TYPE = ['MAIN', 'TABLE', 'KITCHEN'] as const;
export type PosClientType = (typeof CLIENT_TYPE)[number];

export interface PosResponse {
  requestId?: string; // 요청에 대한 응답일 경우 ID 포함
  success: boolean;
  data?: any; // 성공 데이터
  error?: string; // 에러 메시지
  errorCode?: string; // 에러 코드 (예: TIMEOUT)
  errorMessage?: string; // 에러 메세지
  type?: string;
  payload?: any;
}

export interface CommandResponseMap {
  PAYMENT_REQUEST: PaymentResult;
  PRINT_RECEIPT: PrintResult;
  ORDER_INCOMING: void;
}
