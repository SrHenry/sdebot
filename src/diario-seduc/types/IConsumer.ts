import type { IWorker } from '@/common/types/IWorker';
import type { Context } from './Context';

export interface IConsumer extends IWorker<Context> {
  execute(): Promise<Response[]>;
}
