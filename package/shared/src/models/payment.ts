import { z } from 'zod';

const PaymentPayloadSchema = z.object({
  amount: z.number().min(100, '100원 이상 결제 필요.'),
  orderName: z.string().min(1),
});

export type PaymentPayload = z.infer<typeof PaymentPayloadSchema>;

export const PaymentCommandSchema = z.object({
  type: z.literal('PAYMENT_REQUEST'),
  id: z.string().uuid(),
  timestamp: z.number(),
  payload: PaymentPayloadSchema,
});

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
