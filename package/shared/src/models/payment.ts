export interface PaymentPayload {
  amount: number;
  orderName: string;
}

export interface PaymentCommand {
  type: 'PAYMENT_REQUEST';
  id: string;
  timestamp: number;
  payload: PaymentPayload;
}

export interface PaymentResult {
  approvalNo: string;
  cardNum: string;
}
