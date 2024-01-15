import { Queue } from '../Queue';

export interface IWorker<T> {
  queue: Queue<T>;
  concurrency: number;
  execute(): Promise<any>;
}
