import { Queue } from '@/common/Queue';
import { debug } from '@/common/functions/debug';
import { group } from '@/common/functions/group';
import { Consumer } from '@/diario-seduc/Consumer';
import { fetchMissingConteudosFromMemory } from '@/diario-seduc/functions/fetchMissingConteudosFromMemory';
import { fetchTurmasWithRateLimit } from '@/diario-seduc/functions/fetchTurmasWithRateLimit';
import { prepareAllContents } from '@/diario-seduc/functions/prepareAllContents';
import type { MemoryFile } from '@/diario-seduc/types/MemoryFile';

export async function runWithQueue(
  _memory: MemoryFile,
  rateLimit = RATE_LIMIT,
  concurrency = CONCURRENCY,
) {
  debug('[runWithQueue::Function] >> Starting...');

  const responsesGroups: Response[][] = [];
  const memory = await fetchMissingConteudosFromMemory(_memory);
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
