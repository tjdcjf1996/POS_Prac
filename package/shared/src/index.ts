export interface PaymentPayload {
  amount: number;
  orderName: string;
}

export interface ReceiptPayload {
  text: string;
}

export interface OrderPayload {
  menu: string;
  price: number;
}

export interface PaymentCommand {
  type: 'PAYMENT_REQUEST';
  id: string;
  timestamp: number;
  payload: PaymentPayload;
}

export interface PrintCommand {
  type: 'PRINT_RECEIPT';
  id: string;
  timestamp: number;
  payload: ReceiptPayload;
}

export interface OrderCommand {
  type: 'ORDER_INCOMING';
  id: string;
  timestamp: number;
  payload: OrderPayload;
}

export interface HandshakeCommand {
  type: 'HANDSHAKE';
  id: string;
  timestamp: number;
  payload?: never;
}

export type PosCommand = PaymentCommand | PrintCommand | OrderCommand | HandshakeCommand;

export interface PosResponse {
  requestId?: string; // 요청에 대한 응답일 경우 ID 포함
  success: boolean;
  data?: any; // 성공 데이터
  error?: string; // 에러 메시지
  errorCode?: string; // 에러 코드 (예: TIMEOUT)
  type?: string;
  payload?: any;
}
