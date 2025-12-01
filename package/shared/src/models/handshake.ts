export interface HandshakeCommand {
  type: 'HANDSHAKE';
  id: string;
  timestamp: number;
  payload?: never;
}
