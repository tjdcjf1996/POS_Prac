import { PosClientType } from '@posprac/shared';

export interface ClientConfig {
  url: string;
  type: PosClientType;
  id?: string;
}
