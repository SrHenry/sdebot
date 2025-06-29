import { IWorker } from '@/common/types/IWorker';
import { Context } from '@/diario-seduc/types/Context';

export interface IConsumer extends IWorker<Context> {
  execute(): Promise<Response[]>;
}
