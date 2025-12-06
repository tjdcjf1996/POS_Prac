import { z } from 'zod';

const ReceiptPayloadSchema = z.object({
  text: z.string().max(50, '50자 제한'),
});

export type ReceiptPayload = z.infer<typeof ReceiptPayloadSchema>;

export const PrintCommandSchema = z.object({
  type: z.literal('PRINT_RECEIPT'),
  id: z.string().uuid(),
  timestamp: z.number(),
  payload: ReceiptPayloadSchema,
});

export interface PrintCommand {
  type: 'PRINT_RECEIPT';
  id: string;
  timestamp: number;
  payload: ReceiptPayload;
}

export interface PrintResult {
  success: boolean;
}
