export interface IPrinter {
  connect(): Promise<void>;
  print(text: string): Promise<void>;
}

export interface ICardReader {
  connect(): Promise<void>;
  readCard(): Promise<string>;
  cancel(): void;
}
