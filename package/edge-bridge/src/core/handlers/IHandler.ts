import { PosCommand } from '@posprac/shared';

export interface IHandler {
  execute(command: PosCommand): Promise<void>;
}
