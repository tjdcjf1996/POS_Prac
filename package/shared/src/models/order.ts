import { z } from 'zod';

const OrderPayloadSchema = z.object({
  menu: z.string().max(50, '메뉴명 50자 제한'),
  price: z.number().min(100, '주문금액 100원 이상'),
});

export type OrderPayload = z.infer<typeof OrderPayloadSchema>;

export const OrderCommandSchema = z.object({
  type: z.literal('ORDER_INCOMING'),
  id: z.string().uuid(),
  timestamp: z.number(),
  payload: OrderPayloadSchema,
});

export interface OrderCommand {
  type: 'ORDER_INCOMING';
  id: string;
  timestamp: number;
  payload: OrderPayload;
}
