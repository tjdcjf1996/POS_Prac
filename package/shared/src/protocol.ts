import { OrderCommandSchema, type OrderCommand } from './models/order';
import { PaymentCommandSchema, type PaymentCommand, type PaymentResult } from './models/payment';
import { PrintCommandSchema, type PrintCommand, type PrintResult } from './models/printer';
import { z } from 'zod';

export type PosCommand = PaymentCommand | PrintCommand | OrderCommand;
// zod 용 스키마
export const PosCommandSchema = z.discriminatedUnion('type', [
  PaymentCommandSchema,
  OrderCommandSchema,
  PrintCommandSchema,
]);

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
