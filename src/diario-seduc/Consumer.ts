import { Queue } from '@/common/Queue';

import { sleep } from '@/common/functions/sleep';
import { postContent } from './functions/postContent';
import { Context } from './types/Context';
import { IConsumer } from './types/IConsumer';

export class Consumer implements IConsumer {
  public readonly ongoing = new Map<number, Promise<void>>();

  constructor(
    public readonly queue: Queue<Context>,
    public readonly concurrency = 1,
  ) {}

  async execute() {
    const responses: Response[] = [];
    let count = 0;

    while (this.queue.size > 0) {
      if (this.ongoing.size < this.concurrency) {
        const item = this.queue.dequeue()!;

        this.ongoing.set(
          count,
          postContent(item).then(res => {
            responses.push(res);
            this.ongoing.delete(count);
          }),
        );
        count++;
        continue;
      }

      await sleep(CONSUMER_SLEEP_INTERVAL);
    }

    return responses;
  }

  static execute(queue: Queue<Context>, concurrency = 1) {
    return new Consumer(queue, concurrency).execute();
  }
}
