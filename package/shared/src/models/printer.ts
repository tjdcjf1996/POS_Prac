export interface ReceiptPayload {
  text: string;
}

export interface PrintCommand {
  type: 'PRINT_RECEIPT';
  id: string;
  timestamp: number;
  payload: ReceiptPayload;
}

export interface PrintResult {
  success: boolean;
}
