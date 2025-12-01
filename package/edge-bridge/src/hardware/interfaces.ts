import { PaymentResult } from "@posprac/shared";

export interface IPrinter {
  connect(): Promise<void>;
  print(text: string): Promise<void>;
}

export interface ICardReader {
  connect(): Promise<void>;
  readCard(): Promise<PaymentResult>;
  cancel(): void;
}
