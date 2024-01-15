import { Queue } from '@/common/Queue';

import { debug } from '@/common/functions/debug';
import { Consumer } from '../Consumer';
import type { Memory } from '../types/Memory';
import { fetchTurmasWithRateLimit } from './fetchTurmasWithRateLimit';
import { group } from './group';
import { prepareAllContents } from './prepareAllContents';

export async function runWithQueue(
  memory: Memory,
  rateLimit = RATE_LIMIT,
  concurrency = CONCURRENCY,
) {
  debug('[runWithQueue::Function] >> Starting...');

  const responsesGroups: Response[][] = [];

  const bims = group(memory).by('conteudos', 'turmas');

  debug('[runWithQueue::Function] >> Ready!', { memory, bims });

  for (const [bim, { conteudos, turmas: urls }] of Object.entries(bims)) {
    debug(`[runWithQueue::Function] >> [bim::const::for (${bim})]`, {
      conteudos,
      urls,
    });

    const turmas = await fetchTurmasWithRateLimit(urls, rateLimit);
    const preparedContents = await Promise.all(
      turmas.map(turma => prepareAllContents(conteudos, turma)),
    );

    debug(`[runWithQueue::Function] >> [bim::string::for (${bim})]`, {
      preparedContents,
    });

    const queue = new Queue(preparedContents.flat());
    const responses = await Consumer.execute(queue, concurrency);

    debug(`[runWithQueue::Function] >> [bim::string::for (${bim})]`, {
      responses,
    });

    responsesGroups.push(responses);
  }

  debug('[runWithQueue::Function]: Finished!');
}
