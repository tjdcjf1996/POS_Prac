export interface OrderPayload {
  menu: string;
  price: number;
}

export interface OrderCommand {
  type: 'ORDER_INCOMING';
  id: string;
  timestamp: number;
  payload: OrderPayload;
}
