import { debug } from '@/common/functions/debug';
import { group } from '@/common/functions/group';
import { fetchMissingConteudosFromMemory } from '@/diario-seduc/functions/fetchMissingConteudosFromMemory';
import { fetchTurmas } from '@/diario-seduc/functions/fetchTurmas';
import { postContent } from '@/diario-seduc/functions/postContent';
import { prepareAllContents } from '@/diario-seduc/functions/prepareAllContents';
import type { MemoryFile } from '@/diario-seduc/types/MemoryFile';

export async function run(_memory: MemoryFile) {
  debug('[run::Function] >> Starting...');

  const responsesGroups: Response[][] = [];
  const memory = await fetchMissingConteudosFromMemory(_memory);
  const bims = group(memory).by('conteudos', 'turmas');

  debug('[run::Function] >> Ready!', { memory, bims });

  for (const [bim, { conteudos, turmas: urls }] of Object.entries(bims)) {
    debug(`[run::Function] >> [bim::const::for (${bim})]`, { conteudos, urls });

    const turmas = await fetchTurmas(urls);
    const preparedContents = await Promise.all(
      turmas.map(turma => prepareAllContents(conteudos, turma)),
    );

    debug(`[run::Function] >> [bim::string::for (${bim})]`, {
      preparedContents,
    });

    const responses = await Promise.all(
      preparedContents.flat().map(postContent),
    );

    debug(`[run::Function] >> [bim::string::for (${bim})]`, {
      responses,
    });

    responsesGroups.push(responses);
  }

  debug('[run::Function]: Finished!');
}
